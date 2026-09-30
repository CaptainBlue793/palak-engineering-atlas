/* =========================================================
   The Engineering Atlas — optional accounts & progress sync
   ---------------------------------------------------------
   Progress lives in localStorage, exactly as before. When a
   visitor signs in (email + phone, then a one-time code sent
   by email), this module mirrors every Atlas key (sd-*, ml-*, dsa-*,
   lld-*, os-*, net-*, db-*, dist-*, ops-*, atlas-*) to the accounts API (api/, a
   Cloudflare Worker + D1) and keeps devices in step:

   • first sign-in on a device  -> merge local and account data
     (chapters done are unioned, best quiz scores kept, flashcard
     schedules keep the most-reviewed copy, other keys: newest wins)
   • afterwards                 -> newest write wins, key by key;
     other devices pick changes up every 30 s and on tab focus

   Dormant (renders nothing) when account-config.js has no API
   address, or when the page is opened from file:// (the offline
   single-file editions).
   ========================================================= */
import { apiBase, localApiBase, defaultCountryCode } from './account-config.js';

const TRACK = (k) => /^(sd|ml|dsa|lld|os|net|db|dist|ops|atlas)-/.test(k);
const META = '__acct-meta';    // { key: last-modified ms } for this browser
const LAST = '__acct-uid';     // account this browser last synced with (email|phone)
const TOKEN = '__acct-token';  // session token from the API
const WHO = '__acct-user';     // { email, phone } of the signed-in account
const HIST_KEEP = 40;
const POLL_MS = 30000;

const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const API = ((isLocal && localApiBase) || apiBase || '').replace(/\/+$/, '');

if (API && /^https?:$/.test(location.protocol) && !window.__atlasAccount) {
  window.__atlasAccount = true;
  boot().catch((e) => console.warn('[account] disabled:', e));
}

async function boot() {
  /* ---------- 1. watch localStorage writes (before anything else) ---------- */
  const rawSet = Storage.prototype.setItem, rawRemove = Storage.prototype.removeItem;
  let applying = false, onTouch = () => {};
  const meta = readJSON(META, {});
  const saveMeta = () => rawSet.call(localStorage, META, JSON.stringify(meta));
  const touched = (k) => { meta[k] = Date.now(); saveMeta(); onTouch(k); };
  Storage.prototype.setItem = function (k, v) {
    const changed = this === localStorage && TRACK(k) && localStorage.getItem(k) !== String(v);
    rawSet.call(this, k, v);
    if (changed && !applying) touched(k);
  };
  Storage.prototype.removeItem = function (k) {
    const had = this === localStorage && TRACK(k) && localStorage.getItem(k) !== null;
    rawRemove.call(this, k);
    if (had && !applying) touched(k);
  };
  const writeLocal = (k, v) => {
    applying = true;
    try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } finally { applying = false; }
  };

  /* ---------- 2. API client ---------- */
  let token = localStorage.getItem(TOKEN);
  async function api(method, path, body) {
    let res;
    try {
      res = await fetch(API + path, {
        method,
        headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: 'Bearer ' + token } : {}) },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (e) { throw { code: 'offline' }; }
    const data = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) {
      if (res.status === 401 && token) forget();        // session ended elsewhere
      throw { code: data?.error || 'server_error', message: data?.message, status: res.status };
    }
    return data;
  }

  /* ---------- 3. sync engine ---------- */
  let ui = { refresh() {}, toast() {} };
  let user = token ? readJSON(WHO, null) : null;
  let dirty = new Set(), pushTimer = 0, pollTimer = 0, status = 'Not synced yet', lastSync = 0, remoteStamp = 0;
  const setStatus = (s) => { status = s; ui.refresh(); };
  const uid = () => user && user.email + '|' + user.phone;

  onTouch = (k) => { if (!user) return; dirty.add(k); clearTimeout(pushTimer); pushTimer = setTimeout(push, 1200); };

  async function push() {
    if (!user || !dirty.size) return;
    const keys = {};
    for (const k of dirty) keys[k] = { v: localStorage.getItem(k), t: meta[k] || Date.now() };
    dirty = new Set();
    try {
      const r = await api('PUT', '/progress', { progress: keys });
      remoteStamp = Math.max(remoteStamp, r.updated_at);
      lastSync = Date.now(); setStatus('Synced');
    } catch (e) { if (user) { Object.keys(keys).forEach((k) => dirty.add(k)); setStatus('Sync paused — ' + friendly(e)); } }
  }

  async function firstSync() {
    setStatus('Syncing…');
    const { progress: remote, updated_at } = await api('GET', '/progress');
    remoteStamp = updated_at;
    const local = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (TRACK(k)) local[k] = localStorage.getItem(k); }
    const firstHere = localStorage.getItem(LAST) !== uid();
    const up = {}; let changedLocal = false;
    for (const k of new Set([...Object.keys(local), ...Object.keys(remote)])) {
      const l = k in local ? local[k] : null, r = remote[k] || { v: null, t: 0 };
      const lt = meta[k] || 0;
      let v;
      if (l != null && r.v != null && l !== r.v) v = firstHere ? mergeValue(k, l, r.v, lt, r.t) : (r.t > lt ? r.v : l);
      else v = l != null ? l : r.v;
      if (v !== l) { writeLocal(k, v); meta[k] = Math.max(lt, r.t); changedLocal = true; }
      if (v !== r.v) { meta[k] = Math.max(Date.now(), lt); up[k] = { v, t: meta[k] }; }
    }
    saveMeta();
    rawSet.call(localStorage, LAST, uid());
    if (Object.keys(up).length) { const r = await api('PUT', '/progress', { progress: up }); remoteStamp = r.updated_at; }
    lastSync = Date.now(); setStatus('Synced');
    if (changedLocal && !sessionStorage.getItem('__acct-reloaded')) {   // show the merged progress once
      sessionStorage.setItem('__acct-reloaded', '1');
      location.reload();
      return;
    }
    sessionStorage.removeItem('__acct-reloaded');
    startPolling();
  }

  async function pull() {
    if (!user || document.hidden) return;
    try {
      const { progress: remote, updated_at } = await api('GET', '/progress');
      if (updated_at <= remoteStamp) return;
      remoteStamp = updated_at;
      const changed = [];
      for (const [k, r] of Object.entries(remote)) {
        if (!TRACK(k) || !(r.t > (meta[k] || 0)) || r.v === localStorage.getItem(k)) continue;
        writeLocal(k, r.v); meta[k] = r.t; changed.push(k);
      }
      lastSync = Date.now(); setStatus('Synced');
      if (!changed.length) return;
      saveMeta();
      changed.forEach((key) => window.dispatchEvent(new StorageEvent('storage', { key })));   // pages that listen repaint
      ui.toast('Progress updated from your account', true);
    } catch (e) { if (user) setStatus('Sync paused — ' + friendly(e)); }
  }

  function startPolling() { stopPolling(); pollTimer = setInterval(pull, POLL_MS); }
  function stopPolling() { clearInterval(pollTimer); pollTimer = 0; }
  addEventListener('focus', () => { if (user) { push(); pull(); } });
  document.addEventListener('visibilitychange', () => { if (user && !document.hidden) pull(); });

  function forget() {                    // local sign-out (token gone or rejected)
    token = null; user = null; stopPolling(); dirty = new Set();
    rawRemove.call(localStorage, TOKEN); rawRemove.call(localStorage, WHO);
    status = 'Not signed in'; ui.refresh();
  }

  async function start() {
    try { await firstSync(); } catch (e) { if (user) setStatus('Sync paused — ' + friendly(e)); }
  }

  /* ---------- 4. account actions ---------- */
  const act = {
    requestCode: (email, phone) => api('POST', '/auth/request-code', { email, phone }),
    verifyCode: async (email, phone, code) => {
      const r = await api('POST', '/auth/verify-code', { email, phone, code });
      token = r.token; user = r.user;
      rawSet.call(localStorage, TOKEN, token); rawSet.call(localStorage, WHO, JSON.stringify(user));
      ui.refresh();
      await start();
    },
    syncNow: async () => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (TRACK(k)) dirty.add(k); } await push(); await pull(); },
    signOut: async (clear) => {
      await push().catch(() => {});
      await api('POST', '/auth/logout').catch(() => {});
      if (clear) { const ks = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (TRACK(k) && !/-theme$/.test(k)) ks.push(k); } ks.forEach((k) => writeLocal(k, null)); }
      rawRemove.call(localStorage, LAST);
      forget();
      if (clear) location.reload();
    },
    remove: async () => {
      await api('DELETE', '/account');
      rawRemove.call(localStorage, LAST);
      forget();
    },
  };

  /* ---------- 5. UI ---------- */
  ui = buildUI({ act, get user() { return user; }, get status() { return status; }, get lastSync() { return lastSync; } });
  ui.refresh();
  if (user) {                            // returning visitor: confirm the session is still valid, then sync
    try { const r = await api('GET', '/me'); user = r.user; rawSet.call(localStorage, WHO, JSON.stringify(user)); ui.refresh(); await start(); }
    catch (e) { if (user) setStatus('Sync paused — ' + friendly(e)); }
  } else status = 'Not signed in';
}

/* ================= merging ================= */
function mergeValue(k, a, b, ta, tb) {
  const A = parse(a), B = parse(b);
  const newer = tb > ta ? b : a;
  if (A === undefined || B === undefined) return newer;
  if (/-(done|pre-ready|ch0-ready)$/.test(k) && Array.isArray(A) && Array.isArray(B))
    return JSON.stringify([...new Set([...A, ...B])].sort((x, y) => (x > y) - (x < y)));
  if (/-quiz$/.test(k) && isObj(A) && isObj(B)) {
    const o = { ...A };
    for (const [id, v] of Object.entries(B)) o[id] = Math.max(+o[id] || 0, +v || 0);
    return JSON.stringify(o);
  }
  if (/-cards$/.test(k) && isObj(A) && isObj(B)) {
    const o = { ...A };
    for (const [id, s] of Object.entries(B)) {
      const c = o[id];
      if (!c || (s.reps || 0) > (c.reps || 0) || ((s.reps || 0) === (c.reps || 0) && (s.due || 0) > (c.due || 0))) o[id] = s;
    }
    return JSON.stringify(o);
  }
  if (/-ready-/.test(k) && isObj(A) && isObj(B)) {
    const o = { ...A };
    for (const [id, v] of Object.entries(B)) o[id] = !!(o[id] || v);
    return JSON.stringify(o);
  }
  if (/-mock-hist$/.test(k) && Array.isArray(A) && Array.isArray(B)) {
    const seen = new Set(), out = [];
    for (const x of [...B, ...A]) { const s = JSON.stringify(x); if (!seen.has(s)) { seen.add(s); out.push(x); } }
    out.sort((x, y) => (x?.t || x?.at || 0) - (y?.t || y?.at || 0));
    return JSON.stringify(out.slice(-HIST_KEEP));
  }
  return newer;
}
const parse = (s) => { try { return JSON.parse(s); } catch (e) { return undefined; } };
const isObj = (x) => x && typeof x === 'object' && !Array.isArray(x);
function readJSON(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }

function friendly(e) {
  const M = {
    offline: 'You seem to be offline. Progress is still saved in this browser.',
    unauthorized: 'Your session has ended. Please sign in again.',
    rate_limited: 'Too many requests. Wait a little and try again.',
    server_error: 'Something went wrong on our side. Please try again.',
  };
  return (e && (e.message || M[e.code])) || 'Something went wrong.';
}

/* ================= interface ================= */
function buildUI(ctx) {
  const css = `
  .acct-btn { font-weight:600; font-size:13px; white-space:nowrap; }
  @media (max-width: 560px) { .acct-btn .acct-lbl { display:none; } }
  .acct-btn .acct-av { display:inline-grid; place-items:center; width:22px; height:22px; border-radius:50%; background:var(--accent,#2563eb); color:#fff; font-size:11.5px; font-weight:800; }
  .acct-scrim { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:300; display:none; align-items:flex-start; justify-content:center; padding:8vh 14px 14px; overflow:auto; }
  .acct-scrim.show { display:flex; }
  .acct-modal { width:100%; max-width:420px; background:var(--surface,#fff); color:var(--text,#111); border:1px solid var(--border,#ddd); border-radius:16px; box-shadow:0 24px 60px rgba(0,0,0,.35); font:15px/1.5 var(--font,system-ui,sans-serif); }
  .acct-modal header { display:flex; align-items:center; gap:10px; padding:16px 18px 6px; }
  .acct-modal h3 { margin:0; font-size:18px; flex:1; }
  .acct-x { border:0; background:none; font-size:22px; line-height:1; cursor:pointer; color:var(--muted,#666); min-width:36px; min-height:36px; }
  .acct-body { padding:6px 18px 18px; }
  .acct-sub { color:var(--muted,#666); font-size:13.5px; margin:0 0 14px; }
  .acct-f { display:block; font-size:13px; font-weight:600; color:var(--muted,#666); margin:0 0 10px; }
  .acct-f input { display:block; width:100%; box-sizing:border-box; margin-top:5px; padding:11px 12px; border-radius:10px; border:1px solid var(--border,#ddd); background:var(--surface-2,#f7f7f9); color:var(--text,#111); font:15px var(--font,system-ui); }
  .acct-f input.acct-code { font:700 22px var(--mono,ui-monospace,monospace); letter-spacing:6px; text-align:center; }
  .acct-row { display:flex; gap:8px; } .acct-row .acct-f:first-child { flex:0 0 88px; } .acct-row .acct-f:last-child { flex:1; }
  .acct-b { display:block; width:100%; margin:8px 0 0; padding:11px 14px; border-radius:10px; border:1px solid var(--border,#ddd); background:var(--surface-2,#f2f3f6); color:var(--text,#111); font:600 14.5px var(--font,system-ui); cursor:pointer; min-height:44px; }
  .acct-b.pri { background:var(--text,#111); color:var(--surface,#fff); border-color:transparent; }
  .acct-b.bad { color:#dc2626; }
  .acct-b:disabled { opacity:.55; cursor:progress; }
  .acct-links { display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; }
  .acct-link { background:none; border:0; color:var(--accent,#2563eb); font:600 13px var(--font,system-ui); cursor:pointer; padding:8px 0; }
  .acct-msg { font-size:13.5px; margin:10px 0 0; min-height:1em; }
  .acct-msg.err { color:#dc2626; } .acct-msg.ok { color:#059669; }
  .acct-id { padding:12px 14px; border-radius:12px; background:var(--surface-2,#f2f3f6); border:1px solid var(--border,#ddd); font-size:14px; margin-bottom:10px; }
  .acct-id div { display:flex; justify-content:space-between; gap:10px; padding:2px 0; } .acct-id b { overflow-wrap:anywhere; text-align:right; }
  .acct-note { font-size:12px; color:var(--muted,#666); margin:14px 0 0; }
  .acct-toast { position:fixed; left:50%; bottom:22px; transform:translateX(-50%); background:var(--text,#111); color:var(--surface,#fff); padding:10px 16px; border-radius:12px; font:600 14px var(--font,system-ui); z-index:310; box-shadow:0 10px 30px rgba(0,0,0,.3); }
  .acct-toast button { margin-left:10px; background:none; border:0; color:inherit; text-decoration:underline; font:inherit; cursor:pointer; }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* header button, next to the theme toggle on every page type */
  const btn = document.createElement('button');
  const place = () => {
    const anchor = document.querySelector('#themeBtn, .topbar .theme-btn, .home-top .theme-btn');
    if (!anchor) return false;
    btn.className = anchor.className.replace(/\btheme-btn\b/, '') + ' acct-btn';
    btn.removeAttribute('id');
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'dialog');
    anchor.parentNode.insertBefore(btn, anchor);
    return true;
  };
  if (!place()) { const mo = new MutationObserver(() => { if (place()) mo.disconnect(); }); mo.observe(document.body, { childList: true, subtree: true }); }

  const scrim = document.createElement('div'); scrim.className = 'acct-scrim';
  scrim.innerHTML = '<div class="acct-modal" role="dialog" aria-modal="true" aria-labelledby="acctTitle"><header><h3 id="acctTitle"></h3><button class="acct-x" aria-label="Close">×</button></header><div class="acct-body"></div></div>';
  document.body.appendChild(scrim);
  const body = scrim.querySelector('.acct-body'), title = scrim.querySelector('#acctTitle');
  const close = () => scrim.classList.remove('show');
  scrim.addEventListener('click', (e) => { if (e.target === scrim || e.target.closest('.acct-x')) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  btn.addEventListener('click', () => { view = ctx.user ? 'account' : 'signin'; render(); scrim.classList.add('show'); setTimeout(() => body.querySelector('input')?.focus(), 50); });

  // view: signin (enter email + phone) | code (enter the code) | account | signout | delete
  let view = 'signin', msg = ['', ''], pending = { email: '', cc: defaultCountryCode, phone: '' };
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const say = (text, kind = 'err') => { msg = [text, kind]; const m = body.querySelector('.acct-msg'); if (m) { m.textContent = text; m.className = 'acct-msg ' + kind; } };
  const busy = async (el, fn) => { el.disabled = true; say(''); try { await fn(); } catch (e) { say(friendly(e)); } finally { el.disabled = false; } };
  const val = (id) => (body.querySelector('#' + id)?.value || '').trim();
  const fullPhone = () => (pending.cc + pending.phone).replace(/[^\d+]/g, '');

  function render() {
    const u = ctx.user;
    if (!u && view === 'code') {
      title.textContent = 'Enter your code';
      body.innerHTML = `<p class="acct-sub">We emailed a 6-digit code to <b>${esc(pending.email)}</b>. It expires in 5 minutes.</p>` +
        `<label class="acct-f">Sign-in code<input id="acctCode" class="acct-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••"></label>` +
        `<button class="acct-b pri" id="acctVerify">Sign in</button>` +
        `<div class="acct-links"><button class="acct-link" id="acctBack">← Change email or phone</button><button class="acct-link" id="acctResend">Send a new code</button></div>` +
        `<p class="acct-msg ${msg[1]}">${esc(msg[0])}</p>`;
    } else if (!u) {
      title.textContent = 'Sign in to sync progress';
      body.innerHTML = `<p class="acct-sub">Your progress already saves in this browser. An account keeps it in step across your phone, laptop and any other device.</p>` +
        `<label class="acct-f">Email<input id="acctEm" type="email" autocomplete="email" placeholder="you@example.com" value="${esc(pending.email)}"></label>` +
        `<div class="acct-row"><label class="acct-f">Code<input id="acctCc" value="${esc(pending.cc)}" inputmode="tel" autocomplete="tel-country-code"></label><label class="acct-f">Phone number<input id="acctPh" inputmode="tel" autocomplete="tel-national" placeholder="98765 43210" value="${esc(pending.phone)}"></label></div>` +
        `<button class="acct-b pri" id="acctSend">Send sign-in code</button>` +
        `<p class="acct-msg ${msg[1]}">${esc(msg[0])}</p><p class="acct-note">Use the same email and phone every time you sign in. We store only these two and your course progress, nothing else, and you can delete your account at any time.</p>`;
    } else {
      title.textContent = 'Your account';
      const ago = ctx.lastSync ? Math.max(0, Math.round((Date.now() - ctx.lastSync) / 1000)) : null;
      body.innerHTML = `<div class="acct-id"><div><span>Email</span><b>${esc(u.email)}</b></div><div><span>Phone</span><b>${esc(u.phone)}</b></div><div><span>Sync</span><b>${esc(ctx.status)}${ago != null && ctx.status === 'Synced' ? ` · ${ago < 60 ? 'just now' : Math.round(ago / 60) + ' min ago'}` : ''}</b></div></div>` +
        (view === 'signout' ? `<p class="acct-sub">Keep this browser's copy of your progress after signing out? On a shared or public computer, choose “clear”.</p><button class="acct-b" id="acctOutKeep">Sign out, keep progress here</button><button class="acct-b bad" id="acctOutClear">Sign out and clear this browser</button><button class="acct-link" id="acctCancel">Cancel</button>`
        : view === 'delete' ? `<p class="acct-sub">This permanently deletes your account and the synced copy of your progress. This browser keeps its own copy.</p><button class="acct-b bad" id="acctDelYes">Delete my account</button><button class="acct-link" id="acctCancel">Cancel</button>`
        : `<button class="acct-b pri" id="acctSync">Sync now</button><button class="acct-b" id="acctOut">Sign out</button><button class="acct-link" id="acctDel" style="color:#dc2626">Delete account</button>`) +
        `<p class="acct-msg ${msg[1]}">${esc(msg[0])}</p>`;
    }
    wire();
  }

  async function sendCode() {
    await ctx.act.requestCode(pending.email, fullPhone());
    view = 'code'; msg = ['Code sent. It can take a minute to arrive; check spam too.', 'ok'];
    render(); body.querySelector('#acctCode')?.focus();
  }

  function wire() {
    const on = (id, fn) => { const el = body.querySelector('#' + id); if (el) el.onclick = () => fn(el); };
    on('acctSend', (el) => busy(el, async () => {
      pending = { email: val('acctEm'), cc: val('acctCc') || defaultCountryCode, phone: val('acctPh') };
      if (!pending.email) throw { message: 'Enter your email.' };
      if (!pending.phone) throw { message: 'Enter your phone number.' };
      await sendCode();
    }));
    on('acctResend', (el) => busy(el, sendCode));
    on('acctVerify', (el) => busy(el, async () => {
      await ctx.act.verifyCode(pending.email, fullPhone(), val('acctCode'));
      view = 'account'; msg = ['', '']; render();
    }));
    on('acctBack', () => { view = 'signin'; msg = ['', '']; render(); });
    on('acctSync', (el) => busy(el, async () => { await ctx.act.syncNow(); say('All progress synced.', 'ok'); }));
    on('acctOut', () => { view = 'signout'; msg = ['', '']; render(); });
    on('acctOutKeep', (el) => busy(el, async () => { await ctx.act.signOut(false); view = 'signin'; msg = ['Signed out. Progress stays in this browser.', 'ok']; render(); }));
    on('acctOutClear', (el) => busy(el, () => ctx.act.signOut(true)));
    on('acctDel', () => { view = 'delete'; msg = ['', '']; render(); });
    on('acctDelYes', (el) => busy(el, async () => { await ctx.act.remove(); view = 'signin'; msg = ['Account deleted.', 'ok']; render(); }));
    on('acctCancel', () => { view = 'account'; msg = ['', '']; render(); });
    body.querySelectorAll('input').forEach((i) => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') body.querySelector('.acct-b.pri')?.click(); }));
  }

  const paintBtn = () => {
    const u = ctx.user;
    if (!u) { btn.innerHTML = '👤 <span class="acct-lbl">Sign in</span>'; btn.title = 'Sign in to sync your progress'; return; }
    btn.innerHTML = `<span class="acct-av">${esc((u.email || '#')[0].toUpperCase())}</span>`;
    btn.title = `Signed in as ${u.email} — ${ctx.status}`;
  };

  let toastEl = null;
  return {
    refresh() {
      paintBtn();
      if (!scrim.classList.contains('show')) return;
      if (ctx.user && !['signout', 'delete'].includes(view)) view = 'account';
      if (!ctx.user && !['signin', 'code'].includes(view)) view = 'signin';
      render();
    },
    toast(text, withReload) {
      toastEl?.remove();
      toastEl = document.createElement('div'); toastEl.className = 'acct-toast';
      toastEl.innerHTML = esc(text) + (withReload ? ' <button>Refresh</button>' : '');
      toastEl.querySelector('button')?.addEventListener('click', () => location.reload());
      document.body.appendChild(toastEl);
      setTimeout(() => toastEl?.remove(), 6000);
    },
  };
}
