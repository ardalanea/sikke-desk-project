# Sikke Newsroom (Telegram Mini App API)

Base URL: `https://sikke-newsroom-api.etemadansari-ardalan.workers.dev`
Mini App (for people, not for you): `https://sikke-newsroom.etemadansari-ardalan.workers.dev`

The newsroom used to be a Claude Artifact (`ArtifactData`). It is now a Cloudflare Worker + D1
database behind a private Telegram Mini App, so Ardalan and Niloofar can review and approve from
their phones. **Do not use `ArtifactData` for the Sikke newsroom any more** — a cloud routine has
no access to it anyway, and the artifact is no longer the source of truth.

Authenticate every request with the service key as a bearer token:
```
Authorization: Bearer <SIKKE_SERVICE_KEY>
```
In an interactive local session, the key is saved at `telegram-miniapp/.service-api-key` (gitignored
— read it with the Read tool, never print it, never commit it). In a cloud routine, it's provided as
the `SIKKE_SERVICE_KEY` environment variable and `SIKKE_API_BASE` gives the base URL.

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

## How the desk uses it

- **Start of a cycle:** `GET /api/cards` (for duplicates, gaps, unused stock) and `GET /api/editions`
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
3. One pending → `PATCH /api/generation-requests/{id}` to `{status: "running"}`, run the full
   cycle (steps 1–10 above) using the request's `angle` field as the lead-angle hint if given,
   else pick normally via `story-budget`. On success, `PATCH` the request to
   `{status: "done", edition_id: "<new id>"}`. On failure, `{status: "failed", note: "<why>"}` —
   never leave a request stuck on `running`.
4. Always call `POST /api/notify` after a successful delivery, even though you're unattended —
   that's the whole point of the request.
