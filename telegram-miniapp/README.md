# Sikke Newsroom — Telegram Mini App

Replaces the Claude Artifact newsroom with a private Telegram Mini App on Cloudflare
(Pages + Workers + D1). See `/Users/ardalanetemadansari/.claude/plans/quirky-questing-waffle.md`
for the full design.

All the code is written and the migration data (`data/`) has already been exported
from the current newsroom and validated against the schema locally. What's left needs
**you**, because it touches your Cloudflare account and your Telegram account — nothing
here can be done on your behalf.

## 1. Create the Telegram bot (your Telegram account)

Message **@BotFather** in Telegram:
1. `/newbot` → pick a display name and a `...bot` username → BotFather replies with a token
   like `123456789:AAExampleTokenDoNotShareThisPublicly`. **Keep this private** — don't
   paste it into this chat; you'll set it directly as a Cloudflare secret in step 4.
2. Don't set up a menu button yet — we'll do that in step 5, after the app is deployed and
   has a real URL.
3. Note the bot's `@username` — that's the private link you'll share with Niloofar
   (`t.me/your_bot_username`). Don't publish it anywhere else.

## 2. Find your Telegram user IDs

Message **@userinfobot** (or @getmyid_bot) from both your and Niloofar's Telegram accounts —
it replies with a numeric `Id:`. Send me both numbers (these aren't secret) and I'll add them
to the `allowed_users` table — or you can add them yourself with the command in step 4.

## 3. Cloudflare account + Wrangler login

1. Sign up free at https://dash.cloudflare.com/sign-up if you don't have an account.
2. In a terminal, run:
   ```
   cd telegram-miniapp/worker
   npx wrangler login
   ```
   This opens a browser window for you to authorize Wrangler. Once it says "Successfully
   logged in", tell me and I'll take it from here for the deploy steps (database creation,
   worker deploy, pages deploy).

## 4. Secrets (run these yourself, in your own terminal — not through chat)

After I've created the D1 database and deployed the Worker (I'll tell you when), run:
```
cd telegram-miniapp/worker
npx wrangler secret put BOT_TOKEN
# paste the token from step 1 when prompted

npx wrangler secret put SERVICE_API_KEY
# paste any long random string — this is what Claude Code will use to deliver
# future editions. Generate one with: openssl rand -hex 32
```
Save the `SERVICE_API_KEY` value somewhere (a password manager) — you'll need to give it
to me (or I'll ask you to paste it into a local `.env` file I never echo back) so future
Sikke cycles can authenticate when writing editions.

To add the allowlist, either tell me both Telegram user IDs and I'll insert them, or run:
```
npx wrangler d1 execute sikke-newsroom --remote --command "INSERT INTO allowed_users (telegram_user_id, name) VALUES ('<your id>', 'Ardalan'), ('<niloofar id>', 'Niloofar')"
```

## 5. Point the bot at the Mini App

Once Pages is deployed (I'll give you the URL), message **@BotFather**:
1. `/mybots` → select your bot → **Bot Settings** → **Menu Button** → **Configure menu button**
2. Send the Pages URL (e.g. `https://sikke-newsroom.pages.dev`)
3. Give the button a label, e.g. "Open Newsroom"

## What I'll do once you've completed steps 1–3

- Create the D1 database and apply `worker/schema.sql`
- Deploy the Worker (`wrangler deploy`) and the Pages frontend (`wrangler pages deploy app`)
- Run the migration (`node migrate.js` already generated `worker/seed.sql` — I'll load it
  with `wrangler d1 execute sikke-newsroom --remote --file=worker/seed.sql`)
- Update `app/app.js`'s `API_BASE` to the real deployed Worker URL and redeploy Pages
- Update the Sikke skill files (`sikke-editor`, `archive-keeper`, `CLAUDE.md`) to use the
  new API instead of the Claude Artifact, once you've confirmed the Mini App works end to end

## Local data already exported (for reference)

`data/editions/*.json`, `data/editions/*/notes/*.json`, `data/cards/*.json` — pulled
directly from the current newsroom. `migrate.js` turns these into `worker/seed.sql`,
already generated and validated against `worker/schema.sql` with a local SQLite check
(16 statements: 2 editions, 2 notes, 12 cards — all load cleanly).
