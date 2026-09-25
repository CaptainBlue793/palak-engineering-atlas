/* =========================================================
   The Engineering Atlas — optional accounts & progress sync
   ---------------------------------------------------------
   Progress lives in localStorage, exactly as before. When a
   visitor signs in (email + password, or phone + SMS code),
   this module mirrors every Atlas key (sd-*, ml-*, dsa-*,
   atlas-*) to one Firestore document, users/{uid} (field: progress), and keeps
   devices in step:

   • first sign-in on a device  -> merge local and account data
     (chapters done are unioned, best quiz scores kept, flashcard
     schedules keep the most-reviewed copy, other keys: newest wins)
   • afterwards                 -> newest write wins, key by key,
     live across open tabs and devices

   Dormant (renders nothing) when account-config.js has no
   Firebase config, or when the page is opened from file://
   (the offline single-file editions).
   ========================================================= */
import { firebaseConfig, signInMethods, defaultCountryCode } from './account-config.js';

const SDK = globalThis.__ATLAS_FIREBASE_SDK || 'https://www.gstatic.com/firebasejs/10.12.2/';   // override only for local tests
const TRACK = (k) => /^(sd|ml|dsa|atlas)-/.test(k);
const META = '__acct-meta';   // { key: last-modified ms } for this browser
const LAST = '__acct-uid';    // uid this browser last synced with
const HIST_KEEP = 40;

if (firebaseConfig && /^https?:$/.test(location.protocol) && !window.__atlasAccount) {
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

  /* ---------- 2. load Firebase ---------- */
  const [{ initializeApp }, A, F] = await Promise.all([
    import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js'), import(SDK + 'firebase-firestore.js'),
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  auth.useDeviceLanguage();
  const db = F.getFirestore(app);

  /* ---------- 3. sync engine ---------- */
  let ui = { refresh() {}, toast() {} };
  let user = null, ref = null, unsub = null, dirty = new Set(), pushTimer = 0, status = 'Not synced yet', lastSync = 0;
  const setStatus = (s) => { status = s; ui.refresh(); };

  onTouch = (k) => { if (!user) return; dirty.add(k); clearTimeout(pushTimer); pushTimer = setTimeout(push, 1200); };

  async function push() {
    if (!user || !dirty.size) return;
    const keys = {};
    for (const k of dirty) keys[k] = { v: localStorage.getItem(k), t: meta[k] || Date.now() };
    dirty = new Set();
    try {
      await F.setDoc(ref, { progress: keys, profile: profileOf(user), updatedAt: F.serverTimestamp() }, { merge: true });
      lastSync = Date.now(); setStatus('Synced');
    } catch (e) { Object.keys(keys).forEach((k) => dirty.add(k)); setStatus('Sync paused — ' + friendly(e)); }
  }

  async function firstSync() {
    setStatus('Syncing…');
    const snap = await F.getDoc(ref);
    const remote = (snap.exists() && snap.data().progress) || {};
    const local = {};
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (TRACK(k)) local[k] = localStorage.getItem(k); }
    const firstHere = localStorage.getItem(LAST) !== user.uid;
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
    rawSet.call(localStorage, LAST, user.uid);
    await F.setDoc(ref, { progress: up, profile: profileOf(user), updatedAt: F.serverTimestamp() }, { merge: true });
    lastSync = Date.now(); setStatus('Synced');
    if (changedLocal && !sessionStorage.getItem('__acct-reloaded')) {   // show the merged progress once
      sessionStorage.setItem('__acct-reloaded', '1');
      location.reload();
      return;
    }
    sessionStorage.removeItem('__acct-reloaded');
    listen();
  }

  function listen() {
    if (unsub) unsub();
    unsub = F.onSnapshot(ref, (snap) => {
      if (snap.metadata.hasPendingWrites || !snap.exists()) return;
      const remote = snap.data().progress || {}, changed = [];
      for (const [k, r] of Object.entries(remote)) {
        if (!TRACK(k) || !(r.t > (meta[k] || 0)) || r.v === localStorage.getItem(k)) continue;
        writeLocal(k, r.v); meta[k] = r.t; changed.push(k);
      }
      if (!changed.length) return;
      saveMeta(); lastSync = Date.now(); setStatus('Synced');
      changed.forEach((key) => window.dispatchEvent(new StorageEvent('storage', { key })));   // pages that listen repaint
      ui.toast('Progress updated from your account', true);
    }, (e) => setStatus('Sync paused — ' + friendly(e)));
  }

  A.onAuthStateChanged(auth, async (u) => {
    user = u; if (unsub) { unsub(); unsub = null; }
    ui.refresh();
    if (!u) { status = 'Not signed in'; return; }
    ref = F.doc(db, 'users', u.uid);
    try { await firstSync(); } catch (e) { setStatus('Sync paused — ' + friendly(e)); }
  });

  /* ---------- 4. account actions ---------- */
  let recaptcha = null, confirmation = null;
  const verifier = (btn) => {
    if (recaptcha) { try { recaptcha.clear(); } catch (e) {} }
    recaptcha = new A.RecaptchaVerifier(auth, btn, { size: 'invisible' });
    return recaptcha;
  };
  const act = {
    signIn: (email, pw) => A.signInWithEmailAndPassword(auth, email, pw),
    signUp: async (email, pw) => { const c = await A.createUserWithEmailAndPassword(auth, email, pw); A.sendEmailVerification(c.user).catch(() => {}); },
    reset: (email) => A.sendPasswordResetEmail(auth, email),
    sendCode: async (phone, btn) => { confirmation = await A.signInWithPhoneNumber(auth, phone, verifier(btn)); },
    linkPhone: async (phone, btn) => { confirmation = await A.linkWithPhoneNumber(user, phone, verifier(btn)); },
    verifyCode: async (code) => { if (!confirmation) throw { code: 'auth/code-expired' }; await confirmation.confirm(code); confirmation = null; await auth.currentUser?.reload?.(); user = auth.currentUser || user; ui.refresh(); push(); },
    linkEmail: async (email, pw) => { await A.linkWithCredential(user, A.EmailAuthProvider.credential(email, pw)); user = auth.currentUser || user; A.sendEmailVerification(user).catch(() => {}); ui.refresh(); push(); },
    syncNow: async () => { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (TRACK(k)) dirty.add(k); } await push(); },
    signOut: async (clear) => {
      if (clear) { const ks = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (TRACK(k) && !/-theme$/.test(k)) ks.push(k); } ks.forEach((k) => writeLocal(k, null)); }
      await push(); rawRemove.call(localStorage, LAST); await A.signOut(auth);
      if (clear) location.reload();
    },
    remove: async () => {
      if (unsub) { unsub(); unsub = null; }
      await F.deleteDoc(ref);
      try { await A.deleteUser(user); }
      catch (e) { await act.syncNow(); listen(); throw e; }   // e.g. requires-recent-login: put the data back
      rawRemove.call(localStorage, LAST);
    },
  };

  /* ---------- 5. UI ---------- */
  ui = buildUI({ act, get user() { return user; }, get status() { return status; }, get lastSync() { return lastSync; } });
  ui.refresh();
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
function profileOf(u) { return { email: u.email || null, phone: u.phoneNumber || null }; }

function friendly(e) {
  const c = (e && e.code) || '';
  const M = {
    'auth/invalid-email': 'That email address doesn’t look right.',
    'auth/missing-password': 'Enter a password.',
    'auth/weak-password': 'Use a password of at least 6 characters.',
    'auth/email-already-in-use': 'An account already uses this email — sign in instead.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/wrong-password': 'Email or password is incorrect.',
    'auth/user-not-found': 'No account uses this email yet — create one.',
    'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
    'auth/invalid-phone-number': 'Enter the full number with its country code, e.g. +91 98765 43210.',
    'auth/missing-phone-number': 'Enter a phone number.',
    'auth/invalid-verification-code': 'That code isn’t right. Check the SMS and try again.',
    'auth/code-expired': 'That code has expired. Send a new one.',
    'auth/credential-already-in-use': 'That phone or email already belongs to another account.',
    'auth/provider-already-linked': 'This sign-in method is already on your account.',
    'auth/requires-recent-login': 'For safety, sign out, sign in again, then retry.',
    'auth/network-request-failed': 'You seem to be offline. Progress is still saved in this browser.',
    'auth/operation-not-allowed': 'This sign-in method isn’t switched on for the site yet.',
    'auth/quota-exceeded': 'SMS limit reached for today. Try email sign-in instead.',
    'permission-denied': 'The server refused access. Check the Firestore rules.',
    'unavailable': 'You seem to be offline. Progress is still saved in this browser.',
  };
  return M[c] || M[c.replace(/^firestore\//, '')] || (e && e.message) || 'Something went wrong.';
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
  .acct-tabs { display:flex; gap:4px; background:var(--surface-2,#f2f3f6); padding:4px; border-radius:10px; margin-bottom:14px; }
  .acct-tabs button { flex:1; border:0; background:none; padding:8px; border-radius:8px; font:600 14px var(--font,system-ui); color:var(--muted,#666); cursor:pointer; min-height:38px; }
  .acct-tabs button.on { background:var(--surface,#fff); color:var(--text,#111); box-shadow:0 1px 3px rgba(0,0,0,.12); }
  .acct-f { display:block; font-size:13px; font-weight:600; color:var(--muted,#666); margin:0 0 10px; }
  .acct-f input { display:block; width:100%; box-sizing:border-box; margin-top:5px; padding:11px 12px; border-radius:10px; border:1px solid var(--border,#ddd); background:var(--surface-2,#f7f7f9); color:var(--text,#111); font:15px var(--font,system-ui); }
  .acct-row { display:flex; gap:8px; } .acct-row .acct-f:first-child { flex:0 0 88px; } .acct-row .acct-f:last-child { flex:1; }
  .acct-b { display:block; width:100%; margin:8px 0 0; padding:11px 14px; border-radius:10px; border:1px solid var(--border,#ddd); background:var(--surface-2,#f2f3f6); color:var(--text,#111); font:600 14.5px var(--font,system-ui); cursor:pointer; min-height:44px; }
  .acct-b.pri { background:var(--text,#111); color:var(--surface,#fff); border-color:transparent; }
  .acct-b.bad { color:#dc2626; }
  .acct-b:disabled { opacity:.55; cursor:progress; }
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
  btn.addEventListener('click', () => { view = ctx.user ? 'account' : view === 'account' ? 'email' : view; render(); scrim.classList.add('show'); setTimeout(() => body.querySelector('input')?.focus(), 50); });

  let view = signInMethods.email ? 'email' : 'phone', phase = 'number', msg = ['', ''];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const say = (text, kind = 'err') => { msg = [text, kind]; const m = body.querySelector('.acct-msg'); if (m) { m.textContent = text; m.className = 'acct-msg ' + kind; } };
  const busy = async (el, fn) => { el.disabled = true; say(''); try { await fn(); } catch (e) { say(friendly(e)); } finally { el.disabled = false; } };
  const val = (id) => (body.querySelector('#' + id)?.value || '').trim();
  const phoneVal = () => (val('acctCc') + val('acctPh')).replace(/[^\d+]/g, '');

  function tabs() {
    if (!(signInMethods.email && signInMethods.phone)) return '';
    return `<div class="acct-tabs" role="tablist"><button data-v="email" class="${view === 'email' ? 'on' : ''}">✉️ Email</button><button data-v="phone" class="${view === 'phone' ? 'on' : ''}">📱 Phone</button></div>`;
  }
  const phoneForm = (label) => phase === 'number'
    ? `<div class="acct-row"><label class="acct-f">Code<input id="acctCc" value="${esc(defaultCountryCode)}" inputmode="tel" autocomplete="tel-country-code"></label><label class="acct-f">Phone number<input id="acctPh" inputmode="tel" autocomplete="tel-national" placeholder="98765 43210"></label></div><button class="acct-b pri" id="acctSend">${label}</button>`
    : `<label class="acct-f">6-digit code from the SMS<input id="acctCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6"></label><button class="acct-b pri" id="acctVerify">Verify</button><button class="acct-link" id="acctBack">← Use a different number</button>`;

  function render() {
    const u = ctx.user;
    if (!u) {
      title.textContent = 'Sign in to sync progress';
      body.innerHTML = `<p class="acct-sub">Your progress already saves in this browser. An account keeps it in step across your phone, laptop and any other device.</p>${tabs()}` +
        (view === 'email'
          ? `<label class="acct-f">Email<input id="acctEm" type="email" autocomplete="email" placeholder="you@example.com"></label><label class="acct-f">Password<input id="acctPw" type="password" autocomplete="current-password" placeholder="At least 6 characters"></label><button class="acct-b pri" id="acctIn">Sign in</button><button class="acct-b" id="acctUp">Create account</button><button class="acct-link" id="acctForgot">Forgot password?</button>`
          : phoneForm('Send code')) +
        `<p class="acct-msg ${msg[1]}">${esc(msg[0])}</p><p class="acct-note">We store only your email or phone number and your course progress — nothing else. You can delete your account at any time.</p>`;
    } else {
      title.textContent = 'Your account';
      const pv = u.providerData.map((p) => p.providerId);
      const hasPhone = pv.includes('phone'), hasPw = pv.includes('password');
      const ago = ctx.lastSync ? Math.max(0, Math.round((Date.now() - ctx.lastSync) / 1000)) : null;
      body.innerHTML = `<div class="acct-id">${u.email ? `<div><span>Email</span><b>${esc(u.email)}${hasPw && !u.emailVerified ? ' · unverified' : ''}</b></div>` : ''}${u.phoneNumber ? `<div><span>Phone</span><b>${esc(u.phoneNumber)}</b></div>` : ''}<div><span>Sync</span><b>${esc(ctx.status)}${ago != null && ctx.status === 'Synced' ? ` · ${ago < 60 ? 'just now' : Math.round(ago / 60) + ' min ago'}` : ''}</b></div></div>` +
        (view === 'addPhone' ? `<p class="acct-sub">Add a phone number so you can also sign in with an SMS code.</p>${phoneForm('Send code')}<button class="acct-link" id="acctCancel">Cancel</button>`
        : view === 'addEmail' ? `<p class="acct-sub">Add an email and password so you can also sign in without SMS.</p><label class="acct-f">Email<input id="acctEm" type="email" autocomplete="email"></label><label class="acct-f">New password<input id="acctPw" type="password" autocomplete="new-password"></label><button class="acct-b pri" id="acctLinkEm">Add email</button><button class="acct-link" id="acctCancel">Cancel</button>`
        : view === 'signout' ? `<p class="acct-sub">Keep this browser's copy of your progress after signing out? On a shared or public computer, choose “clear”.</p><button class="acct-b" id="acctOutKeep">Sign out, keep progress here</button><button class="acct-b bad" id="acctOutClear">Sign out and clear this browser</button><button class="acct-link" id="acctCancel">Cancel</button>`
        : view === 'delete' ? `<p class="acct-sub">This permanently deletes your account and the synced copy of your progress. This browser keeps its own copy.</p><button class="acct-b bad" id="acctDelYes">Delete my account</button><button class="acct-link" id="acctCancel">Cancel</button>`
        : `<button class="acct-b pri" id="acctSync">Sync now</button>${signInMethods.phone && !hasPhone ? '<button class="acct-b" id="acctAddPh">Add phone number</button>' : ''}${signInMethods.email && !hasPw ? '<button class="acct-b" id="acctAddEm">Add email &amp; password</button>' : ''}<button class="acct-b" id="acctOut">Sign out</button><button class="acct-link" id="acctDel" style="color:#dc2626">Delete account</button>`) +
        `<p class="acct-msg ${msg[1]}">${esc(msg[0])}</p>`;
    }
    wire();
  }

  function wire() {
    const on = (id, fn) => { const el = body.querySelector('#' + id); if (el) el.onclick = () => fn(el); };
    body.querySelectorAll('.acct-tabs button').forEach((b) => b.onclick = () => { view = b.dataset.v; phase = 'number'; msg = ['', '']; render(); });
    on('acctIn', (el) => busy(el, () => ctx.act.signIn(val('acctEm'), body.querySelector('#acctPw').value)));
    on('acctUp', (el) => busy(el, () => ctx.act.signUp(val('acctEm'), body.querySelector('#acctPw').value)));
    on('acctForgot', (el) => busy(el, async () => { if (!val('acctEm')) throw { code: 'auth/invalid-email' }; await ctx.act.reset(val('acctEm')); say('Check your inbox for a reset link.', 'ok'); }));
    on('acctSend', (el) => busy(el, async () => {
      if (ctx.user) await ctx.act.linkPhone(phoneVal(), el); else await ctx.act.sendCode(phoneVal(), el);
      phase = 'code'; msg = ['Code sent. It can take a minute to arrive.', 'ok']; render(); body.querySelector('#acctCode')?.focus();
    }));
    on('acctVerify', (el) => busy(el, async () => { await ctx.act.verifyCode(val('acctCode')); phase = 'number'; view = 'account'; msg = ['', '']; render(); }));
    on('acctBack', () => { phase = 'number'; msg = ['', '']; render(); });
    on('acctSync', (el) => busy(el, async () => { await ctx.act.syncNow(); say('All progress synced.', 'ok'); }));
    on('acctAddPh', () => { view = 'addPhone'; phase = 'number'; msg = ['', '']; render(); });
    on('acctAddEm', () => { view = 'addEmail'; msg = ['', '']; render(); });
    on('acctLinkEm', (el) => busy(el, async () => { await ctx.act.linkEmail(val('acctEm'), body.querySelector('#acctPw').value); view = 'account'; msg = ['Email added. We sent a verification link.', 'ok']; render(); }));
    on('acctOut', () => { view = 'signout'; msg = ['', '']; render(); });
    on('acctOutKeep', (el) => busy(el, async () => { await ctx.act.signOut(false); view = signInMethods.email ? 'email' : 'phone'; msg = ['Signed out. Progress stays in this browser.', 'ok']; render(); }));
    on('acctOutClear', (el) => busy(el, () => ctx.act.signOut(true)));
    on('acctDel', () => { view = 'delete'; msg = ['', '']; render(); });
    on('acctDelYes', (el) => busy(el, async () => { await ctx.act.remove(); view = 'email'; msg = ['Account deleted.', 'ok']; render(); }));
    on('acctCancel', () => { view = 'account'; phase = 'number'; msg = ['', '']; render(); });
    body.querySelectorAll('input').forEach((i) => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') body.querySelector('.acct-b.pri')?.click(); }));
  }

  const paintBtn = () => {
    const u = ctx.user;
    if (!u) { btn.innerHTML = '👤 <span class="acct-lbl">Sign in</span>'; btn.title = 'Sign in to sync your progress'; return; }
    const who = u.email || u.phoneNumber || 'Account';
    btn.innerHTML = `<span class="acct-av">${esc((u.email || '#')[0].toUpperCase())}</span>`;
    btn.title = `Signed in as ${who} — ${ctx.status}`;
  };

  let toastEl = null;
  return {
    refresh() { paintBtn(); if (scrim.classList.contains('show')) { if (ctx.user && !['addPhone', 'addEmail', 'signout', 'delete'].includes(view)) view = 'account'; render(); } },
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
