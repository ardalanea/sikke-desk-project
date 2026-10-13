import { json } from "./auth.js";

// Telegram-auth: queue a request for a new edition, then start the cloud routine
// (outside this Worker) that picks up 'pending' rows and runs the Sikke cycle.
// The routine also polls hourly, so a request still gets picked up if the
// direct start is not configured or fails.
export async function requestGeneration(env, body, user) {
  const now = new Date().toISOString();
  const id = `gen-${now}-${Math.random().toString(36).slice(2, 8)}`;
  await env.DB.prepare(
    "INSERT INTO generation_requests (id, requested_by, requested_at, angle, desks_json, status, updated_at) VALUES (?,?,?,?,?,'pending',?)"
  )
    .bind(id, user.telegram_user_id, now, body.angle || "", JSON.stringify(body.desks || []), now)
    .run();
  const started = await fireRoutine(env, id);
  return json({ ok: true, id, started });
}

// Starts the routine through its API trigger. Returns true only when a run
// was actually created; never throws, so queuing cannot fail because of it.
async function fireRoutine(env, requestId) {
  if (!env.ROUTINE_FIRE_URL || !env.ROUTINE_FIRE_TOKEN) return false;
  try {
    const res = await fetch(env.ROUTINE_FIRE_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.ROUTINE_FIRE_TOKEN}`,
        "anthropic-beta": "experimental-cc-routine-2026-04-01",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({ text: `Mini App generation request ${requestId}` }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.log(`routine fire failed: HTTP ${res.status}`);
    return res.ok;
  } catch (err) {
    console.log(`routine fire failed: ${err.message}`);
    return false;
  }
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
