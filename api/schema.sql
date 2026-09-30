-- Engineering Atlas accounts — Cloudflare D1 (SQLite) schema.
-- Apply locally:  npm run db:local     Apply to Cloudflare:  npm run db:remote
-- Safe to re-run: every statement is IF NOT EXISTS.

-- One account per (email, phone) pair: both are entered on every sign-in.
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  UNIQUE (email, phone)
);

-- Synced course progress: a JSON map of localStorage key -> { v: value, t: last-modified ms }.
CREATE TABLE IF NOT EXISTS progress (
  user_id     TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data        TEXT NOT NULL,
  updated_at  INTEGER NOT NULL
);

-- Pending sign-in codes. Only an HMAC hash of the code is stored.
CREATE TABLE IF NOT EXISTS otps (
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  code_hash   TEXT NOT NULL,
  attempts    INTEGER NOT NULL DEFAULT 0,
  expires_at  INTEGER NOT NULL,
  PRIMARY KEY (email, phone)
);

-- Signed-in sessions. Only an HMAC hash of the bearer token is stored.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash  TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions (user_id);

-- Fixed-window rate-limit counters, e.g. key = 'send:email:a@b.com'.
CREATE TABLE IF NOT EXISTS rate_limits (
  key           TEXT PRIMARY KEY,
  count         INTEGER NOT NULL,
  window_start  INTEGER NOT NULL
);
