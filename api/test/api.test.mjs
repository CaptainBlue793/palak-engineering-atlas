// End-to-end test of the accounts API against a running local Worker (`npm run dev` with DEV_MODE=1).
//   node test/api.test.mjs [baseUrl]
const BASE = process.argv[2] || 'http://127.0.0.1:8787';
const ORIGIN = 'http://127.0.0.1:8080';
const run = Date.now().toString(36);
let passed = 0, failed = 0;

async function call(method, path, body, token, origin = ORIGIN) {
  const headers = { 'Content-Type': 'application/json' };
  if (origin) headers.Origin = origin;
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await fetch(BASE + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null, headers: res.headers };
}
function check(name, cond, detail) {
  if (cond) { passed++; console.log('  ✓', name); } else { failed++; console.log('  ✗', name, detail !== undefined ? JSON.stringify(detail) : ''); }
}
const who = (n) => ({ email: `User${n}.${run}@Example.com `, phone: `+91 98765 ${String(n).padStart(5, '0')}` });

console.log('validation');
let r = await call('POST', '/auth/request-code', { email: 'nope', phone: '+919876500000' });
check('bad email rejected', r.status === 400 && r.body.error === 'invalid_email', r.body);
r = await call('POST', '/auth/request-code', { email: 'a@b.com', phone: '12' });
check('bad phone rejected', r.status === 400 && r.body.error === 'invalid_phone', r.body);
r = await call('GET', '/health', undefined, null, 'https://evil.example');
check('foreign origin refused', r.status === 403, r.status);
r = await call('GET', '/health');
check('allowed origin gets CORS header', r.headers.get('access-control-allow-origin') === ORIGIN);

console.log('sign-in');
const A = who(1);
r = await call('POST', '/auth/request-code', A);
check('code requested', r.status === 200 && /^\d{6}$/.test(r.body.dev_code), r.body);
const code = r.body.dev_code;
const wrong = code === '000000' ? '111111' : '000000';
r = await call('POST', '/auth/verify-code', { ...A, code: wrong });
check('wrong code rejected with tries left', r.status === 400 && r.body.error === 'invalid_code' && r.body.attempts_left === 4, r.body);
r = await call('POST', '/auth/verify-code', { email: A.email.trim().toLowerCase(), phone: '+919876500001', code });
check('same code works with normalised email/phone', r.status === 200 && r.body.token && r.body.user.email === A.email.trim().toLowerCase(), r.body);
const token = r.body.token;
r = await call('POST', '/auth/verify-code', { ...A, code });
check('code is single-use', r.status === 400 && r.body.error === 'no_code', r.body);
r = await call('GET', '/me', undefined, token);
check('/me returns the user', r.status === 200 && r.body.user.phone === '+919876500001', r.body);
r = await call('GET', '/me', undefined, 'not-a-token');
check('bad token → 401', r.status === 401 && r.body.error === 'unauthorized', r.body);

console.log('progress');
r = await call('GET', '/progress', undefined, token);
check('empty progress at first', r.status === 200 && Object.keys(r.body.progress).length === 0, r.body);
r = await call('PUT', '/progress', { progress: {
  'sd-done': { v: '[1,2]', t: 1000 }, 'ml-quiz': { v: '{"3":4}', t: 1000 },
  'evil-key': { v: 'x', t: 1 }, '__acct-token': { v: 'x', t: 1 }, 'dsa-done': { v: 5, t: 1 },
} }, token);
check('progress saved', r.status === 200 && r.body.updated_at > 0, r.body);
r = await call('PUT', '/progress', { progress: { 'sd-done': { v: '[9]', t: 500 }, 'ml-quiz': { v: '{"3":5}', t: 2000 } } }, token);
r = await call('GET', '/progress', undefined, token);
const p = r.body.progress;
check('older write ignored, newer write wins', p['sd-done'].v === '[1,2]' && p['ml-quiz'].v === '{"3":5}', p);
check('non-course keys and bad values dropped', !('evil-key' in p) && !('__acct-token' in p) && !('dsa-done' in p), p);
r = await call('GET', '/progress');
check('progress needs a token', r.status === 401);

console.log('same email, different phone = different account');
const B = { email: A.email, phone: '+91 98765 00002' };
r = await call('POST', '/auth/request-code', B);
r = await call('POST', '/auth/verify-code', { ...B, code: r.body.dev_code });
const tokenB = r.body.token;
r = await call('GET', '/progress', undefined, tokenB);
check('second pair cannot see first pair\'s progress', r.status === 200 && Object.keys(r.body.progress).length === 0, r.body);

console.log('attempt limit');
const C = who(3);
r = await call('POST', '/auth/request-code', C);
const cCode = r.body.dev_code, cWrong = cCode === '000000' ? '111111' : '000000';
for (let i = 0; i < 5; i++) r = await call('POST', '/auth/verify-code', { ...C, code: cWrong });
check('5th wrong code burns the code', r.status === 400 && r.body.attempts_left === 0, r.body);
r = await call('POST', '/auth/verify-code', { ...C, code: cCode });
check('correct code no longer works after 5 misses', r.status === 400 && r.body.error === 'no_code', r.body);

console.log('rate limit');
const D = who(4);
for (let i = 0; i < 5; i++) r = await call('POST', '/auth/request-code', D);
check('5 sends per hour allowed', r.status === 200, r.body);
r = await call('POST', '/auth/request-code', D);
check('6th send is rate limited', r.status === 429 && r.body.error === 'rate_limited', r.body);

console.log('logout and delete');
r = await call('POST', '/auth/logout', undefined, token);
check('logout ok', r.status === 204);
r = await call('GET', '/me', undefined, token);
check('token dead after logout', r.status === 401);
r = await call('DELETE', '/account', undefined, tokenB);
check('delete account ok', r.status === 204);
r = await call('GET', '/me', undefined, tokenB);
check('token dead after delete', r.status === 401);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
