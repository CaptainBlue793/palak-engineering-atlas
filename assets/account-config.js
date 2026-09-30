/* =========================================================
   Accounts — where the accounts API lives
   ---------------------------------------------------------
   Accounts are OFF until you set `apiBase` to your deployed
   Cloudflare Worker (see ACCOUNTS.md for the setup). The API
   address is not a secret; the Worker only accepts requests
   from the sites listed in api/wrangler.toml (ALLOWED_ORIGINS).
   ========================================================= */
export const apiBase = 'https://atlas-accounts-api.atlas-accounts-api.workers.dev';
// e.g. export const apiBase = 'https://atlas-accounts-api.<your-subdomain>.workers.dev';

/* For local testing only: when the site is served from localhost / 127.0.0.1 and this is
   set, it is used instead of apiBase. Run the Worker with `cd api && npm run dev`, then set
   this to 'http://127.0.0.1:8787'. Leave it null when committing. */
export const localApiBase = null;

/* Country code pre-filled in the phone field. */
export const defaultCountryCode = '+91';
