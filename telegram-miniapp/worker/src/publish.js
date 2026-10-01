import { json } from "./auth.js";

// Converts the pack's **bold** (common Markdown) to Telegram legacy Markdown's *bold*,
// since that's what parse_mode=Markdown expects. Leaves everything else untouched.
function toTelegramMarkdown(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "*$1*");
}

async function sendToChannel(env, text) {
  const body = {
    chat_id: env.TELEGRAM_CHANNEL_ID,
    text: toTelegramMarkdown(text),
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  };
  let res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  let data = await res.json();
  if (!data.ok) {
    // Formatting can trip legacy Markdown on edge cases; retry once as plain text
    // rather than fail the whole publish over a stray character.
    res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHANNEL_ID, text, disable_web_page_preview: true }),
    });
    data = await res.json();
  }
  return data;
}

// Telegram-auth: publish one language's Telegram-format post to the TEA Media channel.
export async function publishEditionToTelegram(env, id, lang, user) {
  if (!env.TELEGRAM_CHANNEL_ID) {
    return json({ error: "TELEGRAM_CHANNEL_ID not configured" }, 500);
  }
  const row = await env.DB.prepare("SELECT content_json, title FROM editions WHERE id = ?")
    .bind(id)
    .first();
  if (!row) return json({ error: "not found" }, 404);

  const content = JSON.parse(row.content_json);
  const text = content?.[lang]?.telegram;
  if (!text) return json({ error: `no telegram post for ${lang}` }, 400);

  const result = await sendToChannel(env, text);
  if (!result.ok) {
    return json({ error: "telegram send failed", detail: result.description }, 502);
  }

  const now = new Date().toISOString();
  const noteId = `${id}-${now}-${Math.random().toString(36).slice(2, 8)}`;
  await env.DB.prepare(
    "INSERT INTO edition_notes (id, edition_id, by, kind, text, at) VALUES (?,?,?,?,?,?)"
  )
    .bind(
      noteId,
      id,
      user.name || user.telegram_user_id,
      "posted",
      `Published ${lang} Telegram post to the channel automatically.`,
      now
    )
    .run();
  await env.DB.prepare("UPDATE editions SET status='published', updated_at=? WHERE id=?")
    .bind(now, id)
    .run();

  return json({ ok: true, message_id: result.result?.message_id });
}
