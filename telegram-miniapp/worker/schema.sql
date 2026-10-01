-- Sikke newsroom D1 schema. Mirrors the collections documented in
-- .claude/skills/sikke-editor/references/newsroom.md so migration is mechanical.

CREATE TABLE IF NOT EXISTS editions (
  id             TEXT PRIMARY KEY,         -- e.g. "SK-2026-10-08"
  title          TEXT NOT NULL,
  publish_date   TEXT NOT NULL,            -- YYYY-MM-DD
  created_at     TEXT NOT NULL,            -- ISO 8601 UTC
  status         TEXT NOT NULL DEFAULT 'awaiting', -- awaiting | changes | approved | published
  lead_card      TEXT NOT NULL,
  why            TEXT NOT NULL DEFAULT '',
  judgment_json       TEXT NOT NULL DEFAULT '[]',  -- string[]
  posting_notes_json  TEXT NOT NULL DEFAULT '[]',  -- string[]
  sources_json        TEXT NOT NULL DEFAULT '[]',  -- [{title,url}]
  content_json         TEXT NOT NULL DEFAULT '{}', -- {EN|FA|TR: {telegram,whatsapp,carousel,reel,linkedin,visual}}
  decided_by    TEXT NOT NULL DEFAULT '',
  decided_at    TEXT NOT NULL DEFAULT '',
  decided_via   TEXT NOT NULL DEFAULT '',   -- newsroom | chat
  updated_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS edition_notes (
  id          TEXT PRIMARY KEY,
  edition_id  TEXT NOT NULL REFERENCES editions(id),
  by          TEXT NOT NULL DEFAULT '',
  kind        TEXT NOT NULL,   -- approve | changes | posted | note | claude
  text        TEXT NOT NULL DEFAULT '',
  at          TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_edition_notes_edition ON edition_notes(edition_id);

CREATE TABLE IF NOT EXISTS cards (
  id          TEXT PRIMARY KEY,         -- e.g. "WIR-0002"
  headline    TEXT NOT NULL,
  status      TEXT NOT NULL,            -- Verified | Needs-2nd-source | Myth
  category    TEXT NOT NULL DEFAULT '',
  era         TEXT NOT NULL DEFAULT '',
  date        TEXT NOT NULL DEFAULT '',
  region      TEXT NOT NULL DEFAULT '',
  country     TEXT NOT NULL DEFAULT '',
  tags_json   TEXT NOT NULL DEFAULT '[]',
  wow         INTEGER NOT NULL DEFAULT 0,
  relevance   INTEGER NOT NULL DEFAULT 0,
  summary     TEXT NOT NULL DEFAULT '',
  sources_json TEXT NOT NULL DEFAULT '[]',  -- [{title,url}], no Tier C
  used_in_json TEXT NOT NULL DEFAULT '[]',  -- edition ids
  checked_on  TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_cards_category ON cards(category);

CREATE TABLE IF NOT EXISTS allowed_users (
  telegram_user_id  TEXT PRIMARY KEY,
  name              TEXT NOT NULL DEFAULT ''
);

-- Queued requests from the Mini App's "Generate new edition" button. A polling
-- routine (not this Worker) checks for 'pending' rows, runs a full Sikke cycle,
-- delivers the edition via PUT /api/editions, then marks the row 'done'.
CREATE TABLE IF NOT EXISTS generation_requests (
  id            TEXT PRIMARY KEY,
  requested_by  TEXT NOT NULL,            -- telegram_user_id
  requested_at  TEXT NOT NULL,
  angle         TEXT NOT NULL DEFAULT '', -- optional free-text hint from the requester
  desks_json    TEXT NOT NULL DEFAULT '[]', -- chosen desk slugs; empty = editor picks via story-budget
  status        TEXT NOT NULL DEFAULT 'pending', -- pending | running | done | failed
  edition_id    TEXT NOT NULL DEFAULT '', -- filled in once the routine delivers it
  note          TEXT NOT NULL DEFAULT '', -- e.g. failure reason
  updated_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_generation_requests_status ON generation_requests(status);

CREATE TABLE IF NOT EXISTS settings (
  id                        TEXT PRIMARY KEY DEFAULT 'default',
  editions_per_week         INTEGER NOT NULL DEFAULT 2,
  platforms_json            TEXT NOT NULL DEFAULT '["telegram","whatsapp","instagram","facebook","linkedin"]',
  regional_politics_policy  TEXT NOT NULL DEFAULT 'ask_each_time', -- ask_each_time | allow_neutral_coverage | always_hold
  default_desks_json        TEXT NOT NULL DEFAULT '[]', -- empty = rotation per capacity.md
  updated_at                TEXT NOT NULL
);
