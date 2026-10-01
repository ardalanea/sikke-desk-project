// Telegram Mini App initData validation (https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
// and the service-key check used by Claude Code's editorial pipeline.

const MAX_INIT_DATA_AGE_SECONDS = 24 * 60 * 60;

async function hmacSha256(keyBytes, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
}

function bytesToHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyInitData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = await hmacSha256(new TextEncoder().encode("WebAppData"), botToken);
  const computed = bytesToHex(await hmacSha256(new Uint8Array(secretKey), dataCheckString));
  if (computed !== hash) return null;

  const authDate = Number(params.get("auth_date") || "0");
  if (!authDate || Date.now() / 1000 - authDate > MAX_INIT_DATA_AGE_SECONDS) return null;

  const userRaw = params.get("user");
  if (!userRaw) return null;
  try {
    return JSON.parse(userRaw); // { id, first_name, username, ... }
  } catch {
    return null;
  }
}

// Returns the allowlisted user {telegram_user_id, name} or null.
export async function requireTelegramUser(request, env) {
  const initData = request.headers.get("X-Telegram-Init-Data");
  if (!initData) return null;
  const user = await verifyInitData(initData, env.BOT_TOKEN);
  if (!user) return null;
  const row = await env.DB.prepare(
    "SELECT telegram_user_id, name FROM allowed_users WHERE telegram_user_id = ?"
  )
    .bind(String(user.id))
    .first();
  return row || null;
}

export function requireServiceKey(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const key = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return key && env.SERVICE_API_KEY && key === env.SERVICE_API_KEY;
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
  });
}
