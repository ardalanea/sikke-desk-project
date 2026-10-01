import { json } from "./auth.js";

const DEFAULTS = {
  editions_per_week: 2,
  platforms: ["telegram", "whatsapp", "instagram", "facebook", "linkedin"],
  regional_politics_policy: "ask_each_time",
  default_desks: [],
};

function rowToSettings(row) {
  return {
    editions_per_week: row.editions_per_week,
    platforms: JSON.parse(row.platforms_json),
    regional_politics_policy: row.regional_politics_policy,
    default_desks: JSON.parse(row.default_desks_json),
    updated_at: row.updated_at,
  };
}

export async function getSettings(env) {
  let row = await env.DB.prepare("SELECT * FROM settings WHERE id = 'default'").first();
  if (!row) {
    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO settings (id, editions_per_week, platforms_json, regional_politics_policy, default_desks_json, updated_at)
       VALUES ('default', ?, ?, ?, ?, ?)`
    )
      .bind(
        DEFAULTS.editions_per_week,
        JSON.stringify(DEFAULTS.platforms),
        DEFAULTS.regional_politics_policy,
        JSON.stringify(DEFAULTS.default_desks),
        now
      )
      .run();
    row = await env.DB.prepare("SELECT * FROM settings WHERE id = 'default'").first();
  }
  return json(rowToSettings(row));
}

export async function putSettings(env, body) {
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO settings (id, editions_per_week, platforms_json, regional_politics_policy, default_desks_json, updated_at)
     VALUES ('default', ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       editions_per_week=excluded.editions_per_week,
       platforms_json=excluded.platforms_json,
       regional_politics_policy=excluded.regional_politics_policy,
       default_desks_json=excluded.default_desks_json,
       updated_at=excluded.updated_at`
  )
    .bind(
      Number(body.editions_per_week) || DEFAULTS.editions_per_week,
      JSON.stringify(body.platforms || DEFAULTS.platforms),
      body.regional_politics_policy || DEFAULTS.regional_politics_policy,
      JSON.stringify(body.default_desks || DEFAULTS.default_desks),
      now
    )
    .run();
  return getSettings(env);
}
