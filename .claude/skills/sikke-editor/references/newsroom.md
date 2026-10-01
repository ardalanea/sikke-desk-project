# Sikke Newsroom (Telegram Mini App API)

Base URL: `https://sikke-newsroom-api.etemadansari-ardalan.workers.dev`
Mini App (for people, not for you): `https://sikke-newsroom.etemadansari-ardalan.workers.dev`

The newsroom used to be a Claude Artifact (`ArtifactData`). It is now a Cloudflare Worker + D1
database behind a private Telegram Mini App, so Ardalan and Niloofar can review and approve from
their phones. **Do not use `ArtifactData` for the Sikke newsroom any more.**

There are two ways to authenticate, depending on what kind of session you're running as:

## Interactive local session (you're running as Claude Code on Ardalan's machine)

Use the REST API with the service key as a bearer token:
```
Authorization: Bearer <SIKKE_SERVICE_KEY>
```
The key is saved at `telegram-miniapp/.service-api-key` (gitignored — read it with the Read tool,
never print it, never commit it).

## Unattended cloud routine

Use the **"Sikke Newsroom" MCP connector** instead — it should already be connected (Ardalan
authorized it once via Settings > Connectors in Claude). Its tools cover everything the REST API
does: `list_pending_generation_requests`, `list_recent_generation_requests`,
`update_generation_request`, `get_settings`, `list_editions`, `get_edition`,
`create_or_update_edition`, `list_cards`, `file_cards`, `notify_edition_ready`. Call these directly
instead of `curl`-ing the REST API — no service key needed or available in this environment.
If the connector isn't there, stop and say so rather than guessing at a credential.

## Endpoints

- `GET /api/editions` — list (no content blob; for checking recent mix / status `changes`).
- `GET /api/editions/{id}` — full edition incl. `content` and `notes`.
- `POST /api/editions` — create or fully replace an edition. Body:
  ```
  {id, title, publish_date, created_at, status, lead_card, why,
   judgment: string[], posting_notes: string[], sources: [{title,url}],
   content: {EN|FA|TR: {telegram, whatsapp, carousel, reel, linkedin, visual}},
   decided_by, decided_at, decided_via}
  ```
  New editions: `status: "awaiting"`, omit `decided_*`.
- `PATCH /api/editions/{id}` — partial update (e.g. for a revision after "changes": merges onto
  the existing row, so you only need to send the fields that changed, same semantics as before).
- `POST /api/cards` — file one or more Verified/Needs-2nd-source/Myth cards (batch is fine: send
  an array). Same card shape as `fact-card` skill, flattened (`tags`, `sources`, `used_in` as
  plain arrays, not nested under `data`).
- `POST /api/notify` — after delivering, call with `{edition_id, title}` to ping Ardalan and
  Niloofar's Telegram with a "Review edition" button straight into the Mini App.
- `GET /api/settings` — standing decisions set from the Mini App's Settings tab:
  `{editions_per_week, platforms: string[], regional_politics_policy, default_desks: string[]}`.
  `regional_politics_policy` is one of:
  - `ask_each_time` — current default behaviour: flag a Cyprus/Türkiye/Iran-politics-adjacent
    story and stop to ask in chat before writing it, per CLAUDE.md's escalation rule.
  - `allow_neutral_coverage` — write it, facts-only, strictly neutral wording, no loaded language,
    without stopping to ask — but still never take a side and still run it through
    `standards-check`'s political-neutrality gate like any other story.
  - `always_hold` — drop these stories silently at the `story-budget` stage; don't even surface
    them as candidates, and don't mention them in the edition's `judgment` field.
  `default_desks` (if non-empty) overrides `capacity.md`'s rotation for which 3 desks to dispatch
  each cycle — use exactly those desks instead of rotating. `platforms` controls which
  platform formats `post-writer` needs to produce — skip formats for platforms not listed.

## How the desk uses it

- **Start of a cycle:** `GET /api/settings` (apply it for this run — see above), `GET /api/cards`
  (for duplicates, gaps, unused stock) and `GET /api/editions`
  (recent mix, and any edition with status `changes`: `GET` its detail for the notes, revise that
  edition first).
- **Deliver:** `POST /api/editions` with status `awaiting`, then `POST /api/cards` for every newly
  verified card (batch), then `POST /api/notify`.
- **After approval:** approval happens in the Mini App itself (Ardalan/Niloofar tap Approve) or,
  if they tell you in chat, `PATCH /api/editions/{id}` with `decided_by`, `decided_at` (now, ISO),
  `decided_via: "chat"`, `status: "approved"`. Either way, also add the edition id to the lead
  card's `used_in` via `POST /api/cards`.
- **Revisions:** for `changes`, `PATCH` the `content` field, set `status` back to `awaiting`.
- Never set `approved` or `published` yourself unless Ardalan or Niloofar told you to in chat —
  same rule as always, just a different transport now.

## Running unattended (cloud routine)

When you're running as the scheduled polling routine rather than an interactive session:
1. `GET {SIKKE_API_BASE}/api/generation-requests` (service key) for pending requests.
2. None pending → stop immediately, don't do anything else this run.
3. One pending → `PATCH /api/generation-requests/{id}` to `{status: "running"}`, then `GET
   /api/settings`. Run the full cycle (steps 1–10 above): if the request's `desks` array is
   non-empty, dispatch exactly those desks (skip `capacity.md` rotation); else use
   `default_desks` from settings if set, else rotate normally. Use the request's `angle` field as
   the lead-angle hint if given, else pick normally via `story-budget`. Apply
   `regional_politics_policy` from settings exactly as described above. On success, `PATCH` the
   request to `{status: "done", edition_id: "<new id>"}`. On failure, `{status: "failed", note:
   "<why>"}` — never leave a request stuck on `running`.
4. Always call `POST /api/notify` after a successful delivery, even though you're unattended —
   that's the whole point of the request.
