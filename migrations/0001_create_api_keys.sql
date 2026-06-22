CREATE TABLE IF NOT EXISTS api_keys (
  key        TEXT PRIMARY KEY,
  label      TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
);
