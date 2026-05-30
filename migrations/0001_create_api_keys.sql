-- Keys that may call POST /api. One row per key.
-- Add:    wrangler d1 execute metasearch --remote --command "INSERT INTO api_keys (key, label) VALUES ('<key>', '<label>')"
-- List:   wrangler d1 execute metasearch --remote --command "SELECT label, created_at FROM api_keys"
-- Revoke: wrangler d1 execute metasearch --remote --command "DELETE FROM api_keys WHERE key = '<key>'"
CREATE TABLE IF NOT EXISTS api_keys (
  key        TEXT PRIMARY KEY,
  label      TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
);
