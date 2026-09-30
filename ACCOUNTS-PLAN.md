# Accounts v2 — plan (replace Firebase with a free, self-owned backend)

Status: **implemented and deployed** (2026-09-30) on `feature/accounts`: Worker live at
`https://atlas-accounts-api.atlas-accounts-api.workers.dev`, D1 in APAC, real email sign-in verified.
Goes live for learners once `feature/accounts` is merged to `main`. This replaced the Firebase design.

## Goal

A visitor signs in with **email + phone**. One 6-digit code is generated and sent
(email now; SMS can be added later), and entering it logs them in. The account stores
their email, phone and course progress so it syncs across devices. Everything runs on
free tiers.

## Final stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | Existing static site on GitHub Pages + vanilla JS (`assets/account.js`) | Sign-in pop-up, progress sync |
| Backend API | Cloudflare Workers (JavaScript), deployed with Wrangler | Send code, verify code, get/save progress, log out |
| Database | Cloudflare D1 (SQLite) | Users, progress, one-time codes, sessions, rate limits |
| Email | Resend | Delivers the code |
| Crypto | Web Crypto (built into Workers) | HMAC hashes of codes and session tokens |
| Session | Random token in `localStorage`, sent as `Authorization: Bearer …` | 30-day login; avoids cross-site cookie blocking (github.io ↔ workers.dev) |

Not used: Firebase (removed), Redis (D1 covers short-lived data), SMS (optional later).

## Decisions already made

- **Identity = the email + phone pair.** Both are entered on every login; the account is
  looked up by the pair, so entering someone else's phone with your own email creates a
  separate account.
- **One code, any channel.** The same code goes to every channel in use; the first
  correct entry logs in and the code is deleted. Accepted trade-off: a login proves
  control of at least one channel, not both.
- **Email only for now** (free). Phone is stored on the account; SMS is a later add-on.
- Codes: 6 digits, stored only as an HMAC hash, expire after **5 minutes**, max **5**
  wrong attempts.
- Rate limits: max **5 codes per email and per phone per hour**, plus a per-IP limit.
- CORS allow-list: only the site's own origins may call the API.

## D1 schema

```sql
CREATE TABLE users       (id TEXT PRIMARY KEY, email TEXT NOT NULL, phone TEXT NOT NULL,
                          created_at INTEGER NOT NULL, UNIQUE (email, phone));
CREATE TABLE progress    (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                          data TEXT NOT NULL, updated_at INTEGER NOT NULL);
CREATE TABLE otps        (email TEXT NOT NULL, phone TEXT NOT NULL, code_hash TEXT NOT NULL,
                          attempts INTEGER NOT NULL DEFAULT 0, expires_at INTEGER NOT NULL,
                          PRIMARY KEY (email, phone));
CREATE TABLE sessions    (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL
                          REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
CREATE TABLE rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, window_start INTEGER NOT NULL);
```

## API

| Method + path | Body / auth | Result |
|---|---|---|
| `POST /auth/request-code` | `{email, phone}` | Rate-limit, create code, email it → `204` |
| `POST /auth/verify-code` | `{email, phone, code}` | Check hash + expiry + attempts; find/create user; new session → `{token, user}` |
| `GET /progress` | Bearer token | `{data, updated_at}` |
| `PUT /progress` | Bearer token, `{data}` | Save (size-capped) → `204` |
| `POST /auth/logout` | Bearer token | Delete session → `204` |
| `DELETE /account` | Bearer token | Delete user, progress, sessions → `204` |

Error bodies use a stable `code` (`invalid_code`, `code_expired`, `too_many_attempts`,
`rate_limited`, `unauthorized`) that the pop-up maps to friendly messages.

## Steps, in order

### Phase 0 — accounts and setup (owner, ~15 min)
1. Create a free **Cloudflare** account; install Wrangler (`npm i -g wrangler`), `wrangler login`.
2. Create a free **Resend** account and an API key. Optional: verify a domain you own so
   emails don't come from Resend's test sender.
3. Decide the API's URL (default `*.workers.dev`; a custom domain is optional).

### Phase 1 — backend skeleton
4. Create `api/` with `wrangler.toml`, `src/index.js` (router), `schema.sql`.
5. `wrangler d1 create atlas-accounts`; add the binding to `wrangler.toml`; apply
   `schema.sql` locally and remotely.
6. Store secrets: `wrangler secret put RESEND_API_KEY`, `wrangler secret put SERVER_SECRET`
   (long random string used as the HMAC key).
7. Add CORS handling (allow-list: GitHub Pages origin + `http://127.0.0.1:8080` for local testing).

### Phase 2 — sign-in endpoints
8. `request-code`: validate email/phone format (E.164 phone), rate-limit, generate the
   code with `crypto.getRandomValues`, store its HMAC hash with expiry, send via Resend.
9. `verify-code`: look up the pending code, check expiry and attempts, compare hashes in
   constant time, delete the code on success, upsert the user by (email, phone), create a
   session (store only the token's hash), return the token.
10. `logout` and `DELETE /account`.

### Phase 3 — progress sync
11. `GET/PUT /progress` behind a session check (token hash lookup + expiry).
12. Cap the payload size (same spirit as the old Firestore rule: ≤ 400 progress entries).
13. Merge rule on the client: union of completed chapters, latest quiz scores win
    (reuse the logic already in `assets/account.js`).

### Phase 4 — frontend
14. Remove Firebase: `firebase.json`, `firestore.rules`, the Firebase SDK imports and
    config in `assets/account-config.js` / `assets/account.js`.
15. `account-config.js` becomes just `export const apiBase = null;` (accounts stay OFF
    until it is set, as today).
16. Rework the pop-up: one form (email + phone, default `+91`) → "Send code" → code field
    → "Sign in"; account view shows email, phone, sync status, sign out, delete account.
17. Store the token in `localStorage`; send it on every API call; on `401` sign out locally.
18. Keep the loader rule: only over http(s), never in the offline `file://` bundle.

### Phase 5 — hardening and checks
19. Test the full flow locally (`wrangler dev` + `python -m http.server 8080`).
20. Test failure cases: wrong code ×5, expired code, resend limit, deleted account, token
    from another user, oversized progress payload, CORS from another origin.
21. Scheduled clean-up (Workers Cron Trigger, daily): delete expired codes, sessions and
    old rate-limit rows.
22. Run the course checks: `node tools/content-audit.cjs check`, `bundle`, and
    `cd dsa && node tools/check-chapters.js`; rebuild the three bundles.

### Phase 6 — ship
23. `wrangler deploy`; set `apiBase` to the deployed URL.
24. Write `ACCOUNTS.md` for the new setup (replacing the Firebase guide).
25. Commit on `feature/accounts`, push, merge to `main` when ready.

### Later (optional)
- **SMS:** add an SMS-provider call in `request-code` (India needs DLT registration and a
  paid balance); set a hard daily cap in the rate limiter.
- **Telegram** as a free second channel (user must start the bot once).

## Free-tier notes (check current limits before launch)
Cloudflare Workers ≈ 100k requests/day; D1 several GB; Resend ≈ 100 emails/day on free.
Enough for thousands of learners.
