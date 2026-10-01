import { json } from "./auth.js";

function rowToCard(row) {
  return {
    id: row.id,
    headline: row.headline,
    status: row.status,
    category: row.category,
    era: row.era,
    date: row.date,
    region: row.region,
    country: row.country,
    tags: JSON.parse(row.tags_json),
    wow: row.wow,
    relevance: row.relevance,
    summary: row.summary,
    sources: JSON.parse(row.sources_json),
    used_in: JSON.parse(row.used_in_json),
    checked_on: row.checked_on,
  };
}

export async function listCards(env, url) {
  const status = url.searchParams.get("status");
  const category = url.searchParams.get("category");
  let query = "SELECT * FROM cards";
  const clauses = [];
  const binds = [];
  if (status) {
    clauses.push("status = ?");
    binds.push(status);
  }
  if (category) {
    clauses.push("category = ?");
    binds.push(category);
  }
  if (clauses.length) query += " WHERE " + clauses.join(" AND ");
  query += " ORDER BY wow DESC, relevance DESC";
  const { results } = await env.DB.prepare(query).bind(...binds).all();
  return json(results.map(rowToCard));
}

// Service-key only: file one or more verified cards (archive-keeper).
export async function putCards(env, cards) {
  const stmts = cards.map((c) =>
    env.DB.prepare(
      `INSERT INTO cards (id, headline, status, category, era, date, region, country,
       tags_json, wow, relevance, summary, sources_json, used_in_json, checked_on)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET
         headline=excluded.headline, status=excluded.status, category=excluded.category,
         era=excluded.era, date=excluded.date, region=excluded.region, country=excluded.country,
         tags_json=excluded.tags_json, wow=excluded.wow, relevance=excluded.relevance,
         summary=excluded.summary, sources_json=excluded.sources_json,
         used_in_json=excluded.used_in_json, checked_on=excluded.checked_on`
    ).bind(
      c.id,
      c.headline,
      c.status,
      c.category || "",
      c.era || "",
      c.date || "",
      c.region || "",
      c.country || "",
      JSON.stringify(c.tags || []),
      c.wow || 0,
      c.relevance || 0,
      c.summary || "",
      JSON.stringify(c.sources || []),
      JSON.stringify(c.used_in || []),
      c.checked_on || ""
    )
  );
  await env.DB.batch(stmts);
  return json({ ok: true, count: cards.length });
}
