/* =========================================================
   Engineering Atlas — accounts API (Cloudflare Worker + D1)
   ---------------------------------------------------------
   Sign in with email + phone and a one-time code; sync course progress.

     POST   /auth/request-code   {email, phone}         -> 204   (code emailed)
     POST   /auth/verify-code    {email, phone, code}   -> {token, user, expires_at}
     GET    /me                  Bearer                 -> {user}
     GET    /progress            Bearer                 -> {progress, updated_at}
     PUT    /progress            Bearer {progress}      -> {updated_at}   (key-by-key, newest wins)
     POST   /auth/logout         Bearer                 -> 204
     DELETE /account             Bearer                 -> 204
     GET    /health                                     -> {ok: true}

   Errors are JSON: {error: <stable code>, message}. Codes and tokens are stored
   only as HMAC-SHA256 hashes keyed by the SERVER_SECRET secret.
   ========================================================= */

const CODE_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const LIMITS = {                       // [max, window ms]
  sendEmail: [5, HOUR], sendPhone: [5, HOUR], sendIp: [20, HOUR], verifyIp: [60, HOUR],
};
const MAX_KEYS = 400;                  // progress entries per account
const MAX_BODY = 512 * 1024;           // bytes per request body

export default {
  async fetch(req, env, ctx) {
    const origin = req.headers.get('Origin');
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const cors = origin && allowed.includes(origin)
      ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' } : { 'Vary': 'Origin' };
    if (origin && !allowed.includes(origin)) return json({ error: 'forbidden_origin', message: 'This site may not call the API.' }, 403, cors);
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: { ...cors,
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Max-Age': '86400' } });
    }
    try {
      const res = await route(req, env);
      for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
      return res;
    } catch (e) {
      if (e instanceof ApiError) return json({ error: e.code, message: e.message, ...e.extra }, e.status, cors);
      console.error(e);
      return json({ error: 'server_error', message: 'Something went wrong. Please try again.' }, 500, cors);
    }
  },

  async scheduled(event, env) {        // daily clean-up
    const now = Date.now();
    await env.DB.batch([
      env.DB.prepare('DELETE FROM otps WHERE expires_at < ?').bind(now),
      env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?').bind(now),
      env.DB.prepare('DELETE FROM rate_limits WHERE window_start < ?').bind(now - 24 * HOUR),
    ]);
  },
};

async function route(req, env) {
  const { pathname } = new URL(req.url);
  const m = req.method;
  if (!env.SERVER_SECRET) throw new ApiError(500, 'not_configured', 'The server secret is not set.');
  if (m === 'GET' && pathname === '/health') return json({ ok: true });
  if (m === 'POST' && pathname === '/auth/request-code') return requestCode(req, env);
  if (m === 'POST' && pathname === '/auth/verify-code') return verifyCode(req, env);
  if (m === 'GET' && pathname === '/me') { const s = await auth(req, env); return json({ user: publicUser(s) }); }
  if (m === 'GET' && pathname === '/progress') return getProgress(await auth(req, env), env);
  if (m === 'PUT' && pathname === '/progress') return putProgress(req, await auth(req, env), env);
  if (m === 'POST' && pathname === '/auth/logout') return logout(req, env);
  if (m === 'DELETE' && pathname === '/account') return deleteAccount(await auth(req, env), env);
  throw new ApiError(404, 'not_found', 'No such endpoint.');
}

/* ---------------- sign-in ---------------- */
async function requestCode(req, env) {
  const { email, phone } = identity(await body(req));
  const ip = req.headers.get('CF-Connecting-IP') || 'local';
  await limit(env, 'send:ip:' + ip, LIMITS.sendIp);
  await limit(env, 'send:email:' + email, LIMITS.sendEmail);
  await limit(env, 'send:phone:' + phone, LIMITS.sendPhone);

  const code = randomCode();
  const hash = await hmac(env, `otp:${email}:${phone}:${code}`);
  // A new request replaces any pending code for this pair (and resets its attempts).
  await env.DB.prepare(`INSERT INTO otps (email, phone, code_hash, attempts, expires_at) VALUES (?, ?, ?, 0, ?)
    ON CONFLICT (email, phone) DO UPDATE SET code_hash = excluded.code_hash, attempts = 0, expires_at = excluded.expires_at`)
    .bind(email, phone, hash, Date.now() + CODE_TTL_MS).run();

  if (env.DEV_MODE === '1' && !env.RESEND_API_KEY) {
    console.log(`[dev] sign-in code for ${email} / ${phone}: ${code}`);
    return json({ sent: true, dev_code: code });
  }
  await sendEmail(env, email, code);
  return new Response(null, { status: 204 });
}

async function verifyCode(req, env) {
  const b = await body(req);
  const { email, phone } = identity(b);
  const code = String(b.code ?? '').replace(/\D/g, '');
  if (code.length !== 6) throw new ApiError(400, 'invalid_code', 'Enter the 6-digit code from the email.');
  const ip = req.headers.get('CF-Connecting-IP') || 'local';
  await limit(env, 'verify:ip:' + ip, LIMITS.verifyIp);

  const row = await env.DB.prepare('SELECT code_hash, attempts, expires_at FROM otps WHERE email = ? AND phone = ?')
    .bind(email, phone).first();
  if (!row) throw new ApiError(400, 'no_code', 'No code is waiting for this email and phone. Send a new one.');
  if (row.expires_at < Date.now()) {
    await deleteOtp(env, email, phone);
    throw new ApiError(400, 'code_expired', 'That code has expired. Send a new one.');
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    await deleteOtp(env, email, phone);
    throw new ApiError(429, 'too_many_attempts', 'Too many wrong codes. Send a new one.');
  }
  const ok = equal(await hmac(env, `otp:${email}:${phone}:${code}`), row.code_hash);
  if (!ok) {
    const left = MAX_ATTEMPTS - row.attempts - 1;
    if (left <= 0) await deleteOtp(env, email, phone);
    else await env.DB.prepare('UPDATE otps SET attempts = attempts + 1 WHERE email = ? AND phone = ?').bind(email, phone).run();
    throw new ApiError(400, 'invalid_code', left > 0 ? `That code isn't right. ${left} ${left === 1 ? 'try' : 'tries'} left.` : 'Too many wrong codes. Send a new one.', { attempts_left: Math.max(0, left) });
  }

  // Correct: the code is single-use.
  await deleteOtp(env, email, phone);
  await env.DB.prepare('INSERT INTO users (id, email, phone, created_at) VALUES (?, ?, ?, ?) ON CONFLICT (email, phone) DO NOTHING')
    .bind(crypto.randomUUID(), email, phone, Date.now()).run();
  const user = await env.DB.prepare('SELECT id, email, phone FROM users WHERE email = ? AND phone = ?').bind(email, phone).first();

  const token = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const expires = Date.now() + SESSION_TTL_MS;
  await env.DB.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
    .bind(await hmac(env, 'session:' + token), user.id, expires).run();
  return json({ token, expires_at: expires, user: publicUser(user) });
}

async function logout(req, env) {
  const token = bearer(req);
  if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await hmac(env, 'session:' + token)).run();
  return new Response(null, { status: 204 });
}

async function deleteAccount(s, env) {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM progress WHERE user_id = ?').bind(s.id),
    env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(s.id),
    env.DB.prepare('DELETE FROM users WHERE id = ?').bind(s.id),
  ]);
  return new Response(null, { status: 204 });
}

/* ---------------- progress ---------------- */
async function getProgress(s, env) {
  const row = await env.DB.prepare('SELECT data, updated_at FROM progress WHERE user_id = ?').bind(s.id).first();
  return json({ progress: row ? JSON.parse(row.data) : {}, updated_at: row ? row.updated_at : 0 });
}

async function putProgress(req, s, env) {
  const incoming = (await body(req)).progress;
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) throw new ApiError(400, 'bad_request', 'Expected {progress: {...}}.');
  const row = await env.DB.prepare('SELECT data FROM progress WHERE user_id = ?').bind(s.id).first();
  const data = row ? JSON.parse(row.data) : {};
  for (const [k, e] of Object.entries(incoming)) {
    if (!/^(sd|ml|dsa|lld|atlas)-[\w-]{1,80}$/.test(k)) continue;                // only course keys
    if (!e || typeof e !== 'object' || (e.v !== null && typeof e.v !== 'string') || !Number.isFinite(e.t)) continue;
    if (!data[k] || e.t >= data[k].t) data[k] = { v: e.v, t: e.t };           // newest write wins
  }
  if (Object.keys(data).length > MAX_KEYS) throw new ApiError(413, 'too_large', 'Too much progress data for one account.');
  const text = JSON.stringify(data);
  if (text.length > MAX_BODY) throw new ApiError(413, 'too_large', 'Too much progress data for one account.');
  const now = Date.now();
  await env.DB.prepare(`INSERT INTO progress (user_id, data, updated_at) VALUES (?, ?, ?)
    ON CONFLICT (user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`).bind(s.id, text, now).run();
  return json({ updated_at: now });
}

/* ---------------- helpers ---------------- */
class ApiError extends Error {
  constructor(status, code, message, extra = {}) { super(message); this.status = status; this.code = code; this.extra = extra; }
}

function json(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers } });
}

async function body(req) {
  const text = await req.text();
  if (text.length > MAX_BODY) throw new ApiError(413, 'too_large', 'Request too large.');
  try { return JSON.parse(text || '{}'); } catch (e) { throw new ApiError(400, 'bad_request', 'Body must be JSON.'); }
}

function identity(b) {
  const email = String(b.email ?? '').trim().toLowerCase();
  const phone = '+' + String(b.phone ?? '').replace(/\D/g, '');
  if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(email)) throw new ApiError(400, 'invalid_email', 'That email address doesn’t look right.');
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new ApiError(400, 'invalid_phone', 'Enter the full phone number with its country code, e.g. +91 98765 43210.');
  return { email, phone };
}

async function auth(req, env) {
  const token = bearer(req);
  if (!token) throw new ApiError(401, 'unauthorized', 'Please sign in.');
  const s = await env.DB.prepare(`SELECT u.id, u.email, u.phone FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.expires_at > ?`).bind(await hmac(env, 'session:' + token), Date.now()).first();
  if (!s) throw new ApiError(401, 'unauthorized', 'Your session has ended. Please sign in again.');
  return s;
}

const bearer = (req) => (/^Bearer\s+(\S+)$/.exec(req.headers.get('Authorization') || '') || [])[1] || null;
const publicUser = (u) => ({ email: u.email, phone: u.phone });
const deleteOtp = (env, email, phone) => env.DB.prepare('DELETE FROM otps WHERE email = ? AND phone = ?').bind(email, phone).run();

async function limit(env, key, [max, windowMs]) {
  const now = Date.now();
  const row = await env.DB.prepare(`INSERT INTO rate_limits (key, count, window_start) VALUES (?, 1, ?)
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN window_start < ? THEN 1 ELSE count + 1 END,
      window_start = CASE WHEN window_start < ? THEN excluded.window_start ELSE window_start END
    RETURNING count, window_start`).bind(key, now, now - windowMs, now - windowMs).first();
  if (row.count > max) {
    const mins = Math.max(1, Math.ceil((row.window_start + windowMs - now) / 60000));
    throw new ApiError(429, 'rate_limited', `Too many requests. Try again in about ${mins} minute${mins === 1 ? '' : 's'}.`, { retry_after_minutes: mins });
  }
}

function randomCode() {                 // uniform 6 digits, rejection sampling
  const buf = new Uint32Array(1);
  const lim = Math.floor(0xffffffff / 1e6) * 1e6;
  do crypto.getRandomValues(buf); while (buf[0] >= lim);
  return String(buf[0] % 1e6).padStart(6, '0');
}

let keyCache = null;
async function hmac(env, text) {
  if (!keyCache || keyCache.secret !== env.SERVER_SECRET) {
    keyCache = { secret: env.SERVER_SECRET, key: await crypto.subtle.importKey('raw', new TextEncoder().encode(env.SERVER_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']) };
  }
  const sig = await crypto.subtle.sign('HMAC', keyCache.key, new TextEncoder().encode(text));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function equal(a, b) {                  // constant-time for equal-length hex strings
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

const base64url = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function sendEmail(env, to, code) {
  if (!env.RESEND_API_KEY) throw new ApiError(500, 'not_configured', 'Email sending is not configured.');
  const html = `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5;color:#111">
    <p>Your Engineering Atlas sign-in code is:</p>
    <p style="font-size:30px;font-weight:700;letter-spacing:6px;margin:16px 0">${code}</p>
    <p style="color:#555">It expires in 5 minutes. If you didn't try to sign in, you can ignore this email.</p></div>`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [to], subject: `${code} is your Engineering Atlas sign-in code`,
      text: `Your Engineering Atlas sign-in code is ${code}. It expires in 5 minutes.`, html }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    throw new ApiError(502, 'email_failed', 'We couldn’t send the email just now. Please try again.');
  }
}
