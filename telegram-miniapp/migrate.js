// Reads the JSON export in ./data (pulled from the Claude Artifact newsroom) and
// generates worker/seed.sql for `wrangler d1 execute sikke-newsroom --remote --file=worker/seed.sql`.
// Run once, locally: node migrate.js

import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(import.meta.dirname, "data");
const OUT_FILE = path.join(import.meta.dirname, "worker", "seed.sql");

function sqlStr(v) {
  if (v === undefined || v === null) return "''";
  return `'${String(v).replace(/'/g, "''")}'`;
}
function sqlJson(v) {
  return sqlStr(JSON.stringify(v ?? (Array.isArray(v) ? [] : {})));
}

const lines = [];

// --- editions ---
const editionsDir = path.join(DATA_DIR, "editions");
for (const file of fs.readdirSync(editionsDir)) {
  if (!file.endsWith(".json")) continue;
  const id = file.replace(/\.json$/, "");
  const d = JSON.parse(fs.readFileSync(path.join(editionsDir, file), "utf8"));
  lines.push(`INSERT INTO editions (id, title, publish_date, created_at, status, lead_card, why, judgment_json, posting_notes_json, sources_json, content_json, decided_by, decided_at, decided_via, updated_at) VALUES (${[
    sqlStr(id),
    sqlStr(d.title),
    sqlStr(d.publish_date),
    sqlStr(d.created_at),
    sqlStr(d.status),
    sqlStr(d.lead_card),
    sqlStr(d.why),
    sqlJson(d.judgment),
    sqlJson(d.posting_notes),
    sqlJson(d.sources),
    sqlJson(d.content),
    sqlStr(d.decided_by),
    sqlStr(d.decided_at),
    sqlStr(d.decided_via),
    sqlStr(d.updatedAt || d.created_at),
  ].join(", ")});`);

  const notesDir = path.join(editionsDir, id, "notes");
  if (fs.existsSync(notesDir)) {
    for (const noteFile of fs.readdirSync(notesDir)) {
      if (!noteFile.endsWith(".json")) continue;
      const noteId = noteFile.replace(/\.json$/, "");
      const n = JSON.parse(fs.readFileSync(path.join(notesDir, noteFile), "utf8"));
      lines.push(`INSERT INTO edition_notes (id, edition_id, by, kind, text, at) VALUES (${[
        sqlStr(`${id}-${noteId}`),
        sqlStr(id),
        sqlStr(n.by),
        sqlStr(n.kind),
        sqlStr(n.text),
        sqlStr(n.at),
      ].join(", ")});`);
    }
  }
}

// --- cards ---
const cardsDir = path.join(DATA_DIR, "cards");
for (const file of fs.readdirSync(cardsDir)) {
  if (!file.endsWith(".json")) continue;
  const id = file.replace(/\.json$/, "");
  const c = JSON.parse(fs.readFileSync(path.join(cardsDir, file), "utf8"));
  lines.push(`INSERT INTO cards (id, headline, status, category, era, date, region, country, tags_json, wow, relevance, summary, sources_json, used_in_json, checked_on) VALUES (${[
    sqlStr(id),
    sqlStr(c.headline),
    sqlStr(c.status),
    sqlStr(c.category),
    sqlStr(c.era),
    sqlStr(c.date),
    sqlStr(c.region),
    sqlStr(c.country),
    sqlJson(c.tags),
    Number(c.wow) || 0,
    Number(c.relevance) || 0,
    sqlStr(c.summary),
    sqlJson(c.sources),
    sqlJson(c.used_in),
    sqlStr(c.checked_on),
  ].join(", ")});`);
}

fs.writeFileSync(OUT_FILE, lines.join("\n") + "\n");
console.log(`Wrote ${lines.length} statements to ${OUT_FILE}`);
