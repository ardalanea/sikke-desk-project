import { json } from "./auth.js";

// Service-key only: Claude Code calls this after delivering an edition so both
// allowlisted readers get a native Telegram message with a button into the Mini App.
export async function notifyEditionReady(env, editionId, title) {
  const { results: users } = await env.DB.prepare(
    "SELECT telegram_user_id FROM allowed_users"
  ).all();

  const text = `🗞️ Sikke edition ready: *${title}*\n\nTap below to review.`;
  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "Review edition",
          web_app: { url: `${env.MINIAPP_URL}#/editions/${editionId}` },
        },
      ],
    ],
  };

  const results = await Promise.all(
    users.map((u) =>
      fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          chat_id: u.telegram_user_id,
          text,
          parse_mode: "Markdown",
          reply_markup: replyMarkup,
        }),
      }).then((r) => r.json())
    )
  );

  return json({ ok: true, sent: results });
}
