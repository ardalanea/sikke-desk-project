import { json } from "./auth.js";

// Telegram-auth: queue a request for a new edition. A polling routine (outside
// this Worker) picks up 'pending' rows and runs the Sikke cycle.
export async function requestGeneration(env, body, user) {
  const now = new Date().toISOString();
  const id = `gen-${now}-${Math.random().toString(36).slice(2, 8)}`;
  await env.DB.prepare(
    "INSERT INTO generation_requests (id, requested_by, requested_at, angle, status, updated_at) VALUES (?,?,?,?,'pending',?)"
  )
    .bind(id, user.telegram_user_id, now, body.angle || "", now)
    .run();
  return json({ ok: true, id });
}

// Telegram-auth: so the Mini App can show "request queued, check back soon".
export async function listGenerationRequests(env) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM generation_requests ORDER BY requested_at DESC LIMIT 10"
  ).all();
  return json(results);
}

// Service-key only: the polling routine claims pending requests.
export async function listPendingGenerationRequests(env) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM generation_requests WHERE status = 'pending' ORDER BY requested_at ASC"
  ).all();
  return json(results);
}

// Service-key only: the polling routine updates status as it works.
export async function updateGenerationRequest(env, id, body) {
  const now = new Date().toISOString();
  await env.DB.prepare(
    "UPDATE generation_requests SET status=?, edition_id=?, note=?, updated_at=? WHERE id=?"
  )
    .bind(body.status || "pending", body.edition_id || "", body.note || "", now, id)
    .run();
  return json({ ok: true });
}
