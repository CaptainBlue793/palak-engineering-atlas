# Accounts — optional progress sync

Learners can sign in to keep their progress in step across devices. Everything is optional:
without an account the Atlas works exactly as before, saving progress in the browser. Accounts are
**off** until you deploy the API and set its address in `assets/account-config.js`. Everything
runs on free tiers.

## How it works

```
 browser (localStorage)  ⇄  assets/account.js  ⇄  Cloudflare Worker (api/)  ⇄  D1 database
                                                        │
                                                        └──▶ Resend (sign-in code email)
```

- **Sign in:** the learner enters **email + phone**; the API emails a **6-digit code**; entering it
  signs them in. The account is the email + phone pair, so the same pair must be used every time.
  (SMS is not sent yet; the phone number is stored on the account. See *Adding SMS later*.)
- **Sync:** progress still lives in `localStorage`. `assets/account.js` mirrors every course key
  (`sd-*`, `ml-*`, `dsa-*`, `lld-*`, `atlas-*`) to the API. The first sign-in on a device merges
  (chapters unioned, best quiz scores kept, most-reviewed flashcards kept, otherwise newest wins);
  after that the newest write wins, and other devices pick up changes every 30 s and on tab focus.
- **Never in the offline editions:** the loader only runs over http(s), not from `file://`.

| Part | Technology | Where |
|---|---|---|
| Frontend | Vanilla JS dialog | `assets/account.js`, `assets/account-config.js` |
| API | Cloudflare Worker | `api/src/index.js` |
| Database | Cloudflare D1 (SQLite) | `api/schema.sql` |
| Email | Resend | called from the Worker |

**Security:** codes expire after 5 minutes, allow 5 wrong tries, and are single-use; codes and
session tokens are stored only as HMAC-SHA256 hashes; sending is limited to 5 codes per email and
per phone per hour (plus per-IP limits); only the origins in `ALLOWED_ORIGINS` may call the API;
sessions last 30 days. A daily cron job deletes expired codes and sessions.

## One-time setup (about 15 minutes)

Run these from the `api/` folder. You need free **Cloudflare** and **Resend** accounts.

1. **Install and log in**
   ```bash
   cd api
   npm install
   npx wrangler login              # opens the browser once
   ```
2. **Create the database** and paste the printed `database_id` into `api/wrangler.toml`
   ```bash
   npx wrangler d1 create atlas-accounts
   npm run db:remote               # creates the tables in Cloudflare
   ```
3. **Add the secrets** (you type them in; they are never stored in the repo)
   ```bash
   npx wrangler secret put RESEND_API_KEY     # from resend.com → API Keys
   npx wrangler secret put SERVER_SECRET      # any long random string, e.g. from a password manager
   ```
4. **Choose the email sender.** `EMAIL_FROM` in `api/wrangler.toml` must use a domain verified in
   Resend (Domains → Add; on Cloudflare DNS, *Auto configure* adds the records). The live Atlas
   sends from `Engineering Atlas <login@palakdebpatra.com>`. Resend's test sender
   `onboarding@resend.dev` works without a domain but **only delivers to your own Resend account
   email**. Also add a DMARC record (`TXT` `_dmarc` → `v=DMARC1; p=none;`): without it, and while
   the domain is new, Gmail tends to put the codes in spam.
5. **Check the allowed sites.** `ALLOWED_ORIGINS` in `api/wrangler.toml` must contain the exact
   address the site is served from (default: `https://captainblue793.github.io`).
6. **Deploy**
   ```bash
   npm run deploy                  # prints https://atlas-accounts-api.<you>.workers.dev
   ```
7. **Switch accounts on:** in `assets/account-config.js` set
   `export const apiBase = 'https://atlas-accounts-api.<you>.workers.dev';`, commit and publish.
   A **Sign in** button appears next to the theme toggle on every page.

Check it: `curl https://atlas-accounts-api.<you>.workers.dev/health` should print `{"ok":true}`.

## Local development and tests

```bash
cd api
cp .dev.vars.example .dev.vars     # DEV_MODE=1: codes are returned by the API instead of emailed
npm install
npm run db:local
npm run dev                        # API on http://127.0.0.1:8787
npm test                           # 24 end-to-end API checks against the running dev server
```
To try the dialog locally, serve the site (`python -m http.server 8080` from the repo root) and
set `localApiBase = 'http://127.0.0.1:8787'` in `assets/account-config.js`; set it back to `null`
before committing. Never set `DEV_MODE` on the deployed Worker.

## Free-tier limits (check current numbers)

Cloudflare Workers ≈ 100,000 requests/day, D1 several GB, Resend ≈ 100 emails/day. Plenty for
thousands of learners; the Resend daily cap is the first limit you would meet.

## Adding SMS later

Add an SMS provider call next to `sendEmail` in `api/src/index.js` (`requestCode`) so the same code
is also texted. SMS costs money per message, and Indian numbers need DLT registration first. Keep
the per-phone rate limit, and add a hard daily cap so the bill can't run away.
