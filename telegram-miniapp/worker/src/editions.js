import { json } from "./auth.js";

function rowToEdition(row) {
  return {
    id: row.id,
    title: row.title,
    publish_date: row.publish_date,
    created_at: row.created_at,
    status: row.status,
    lead_card: row.lead_card,
    why: row.why,
    judgment: JSON.parse(row.judgment_json),
    posting_notes: JSON.parse(row.posting_notes_json),
    sources: JSON.parse(row.sources_json),
    content: JSON.parse(row.content_json),
    decided_by: row.decided_by,
    decided_at: row.decided_at,
    decided_via: row.decided_via,
    updated_at: row.updated_at,
  };
}

export async function listEditions(env) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM editions ORDER BY created_at DESC"
  ).all();
  // list view omits the heavy content blob
  return json(results.map((r) => ({ ...rowToEdition(r), content: undefined })));
}

export async function getEdition(env, id) {
  const row = await env.DB.prepare("SELECT * FROM editions WHERE id = ?").bind(id).first();
  if (!row) return json({ error: "not found" }, 404);
  const { results: notes } = await env.DB.prepare(
    "SELECT id, by, kind, text, at FROM edition_notes WHERE edition_id = ? ORDER BY at ASC"
  )
    .bind(id)
    .all();
  return json({ ...rowToEdition(row), notes });
}

// Service-key only: create or fully replace an edition (Claude Code delivering a cycle).
export async function putEdition(env, id, body) {
  const now = new Date().toISOString();
  const existing = await env.DB.prepare("SELECT id FROM editions WHERE id = ?").bind(id).first();

  const fields = {
    title: body.title || "",
    publish_date: body.publish_date || "",
    created_at: body.created_at || now,
    status: body.status || "awaiting",
    lead_card: body.lead_card || "",
    why: body.why || "",
    judgment_json: JSON.stringify(body.judgment || []),
    posting_notes_json: JSON.stringify(body.posting_notes || []),
    sources_json: JSON.stringify(body.sources || []),
    content_json: JSON.stringify(body.content || {}),
    decided_by: body.decided_by || "",
    decided_at: body.decided_at || "",
    decided_via: body.decided_via || "",
    updated_at: now,
  };

  if (existing) {
    await env.DB.prepare(
      `UPDATE editions SET title=?, publish_date=?, status=?, lead_card=?, why=?,
       judgment_json=?, posting_notes_json=?, sources_json=?, content_json=?,
       decided_by=?, decided_at=?, decided_via=?, updated_at=? WHERE id=?`
    )
      .bind(
        fields.title,
        fields.publish_date,
        fields.status,
        fields.lead_card,
        fields.why,
        fields.judgment_json,
        fields.posting_notes_json,
        fields.sources_json,
        fields.content_json,
        fields.decided_by,
        fields.decided_at,
        fields.decided_via,
        fields.updated_at,
        id
      )
      .run();
  } else {
    await env.DB.prepare(
      `INSERT INTO editions (id, title, publish_date, created_at, status, lead_card, why,
       judgment_json, posting_notes_json, sources_json, content_json,
       decided_by, decided_at, decided_via, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
      .bind(
        id,
        fields.title,
        fields.publish_date,
        fields.created_at,
        fields.status,
        fields.lead_card,
        fields.why,
        fields.judgment_json,
        fields.posting_notes_json,
        fields.sources_json,
        fields.content_json,
        fields.decided_by,
        fields.decided_at,
        fields.decided_via,
        fields.updated_at
      )
      .run();
  }
  return json({ ok: true, id });
}

// Telegram-auth: approve | changes | posted, each with an optional note.
export async function decideEdition(env, id, body, user) {
  const kind = body.kind;
  if (!["approve", "changes", "posted", "note"].includes(kind)) {
    return json({ error: "invalid kind" }, 400);
  }
  const edition = await env.DB.prepare("SELECT id FROM editions WHERE id = ?").bind(id).first();
  if (!edition) return json({ error: "not found" }, 404);

  const now = new Date().toISOString();
  const noteId = `${id}-${now}-${Math.random().toString(36).slice(2, 8)}`;
  await env.DB.prepare(
    "INSERT INTO edition_notes (id, edition_id, by, kind, text, at) VALUES (?,?,?,?,?,?)"
  )
    .bind(noteId, id, user.name || user.telegram_user_id, kind, body.text || "", now)
    .run();

  if (kind === "approve") {
    await env.DB.prepare(
      "UPDATE editions SET status='approved', decided_by=?, decided_at=?, decided_via='newsroom', updated_at=? WHERE id=?"
    )
      .bind(user.name || user.telegram_user_id, now, now, id)
      .run();
  } else if (kind === "changes") {
    await env.DB.prepare(
      "UPDATE editions SET status='changes', updated_at=? WHERE id=?"
    )
      .bind(now, id)
      .run();
  } else if (kind === "posted") {
    await env.DB.prepare(
      "UPDATE editions SET status='published', updated_at=? WHERE id=?"
    )
      .bind(now, id)
      .run();
  }

  return json({ ok: true });
}
