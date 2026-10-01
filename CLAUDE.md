# Sikke Desk — project memory

**Sikke by TEA Media** (سکه in Farsi) is a social-media "magazine desk" that finds, fact-checks and writes surprising true stories about money, banking, cons, crypto and frozen money ("money lock"), from ancient history to this week. Owners and approvers: Ardalan and Niloofar (TEA Media founders). Either can approve an edition. Nothing is ever posted without approval.

## Standing decisions

- Brand: Sikke by TEA Media. Tagline EN "Money's strangest true stories" · TR "Paranın en tuhaf gerçek hikâyeleri" · FA "عجیب‌ترین داستان‌های واقعی پول".
- Languages: English, Farsi, Turkish in every edition.
- Platforms: Telegram channel, WhatsApp channel, Instagram + Facebook (carousel, caption, reel script), LinkedIn.
- Pace: 2 editions per week. All 8 research desks exist; the editor rotates 3 per edition (see `.claude/skills/sikke-editor/references/capacity.md`).
- Tone: the "reader-load" (gym weight) rule in `.claude/skills/sikke-voice/SKILL.md`. Tone follows the story and the post length.
- Magazine-grade standards: two sources per fact, an independent fact-checker that never sees reporter notes, exact legal status for named people, no investment advice, political neutrality.
- **Open decision:** how to handle sensitive regional politics (Iran sanctions, the Cyprus question, Turkish/Iranian domestic politics). Until Ardalan and Niloofar decide, flag such stories and ask before writing.
- UI work: use Lucide icons (or similar), never emojis as icons.

## The team (in `.claude/`)

- Skills (`.claude/skills/`): sikke-editor (runs the whole cycle), story-budget, fact-hunter (+ 8 beat briefs and source library), fact-card (format, taxonomy), fact-verify (+ known myths), money-converter, archive-keeper, sikke-voice, post-writer (+ platform specs), trilingual-localizer (+ glossary), standards-check, visual-brief.
- Agents (`.claude/agents/`): antiquity-, history-, cons-, crypto-, moneylock-, oddities-, region-, wire-reporter; fact-checker; fa-editor; tr-editor; standards-editor.
- Paths inside the skills point at `.claude/skills/...` (rewritten from the plugin's `${CLAUDE_PLUGIN_ROOT}`).

To run: "run the Sikke desk" → follow `.claude/skills/sikke-editor/SKILL.md`.

## Shared newsroom (source of truth)

- Newsroom: a private Telegram Mini App (bot `@TEAMedia_SekkeBot`) backed by Cloudflare Workers + D1. Editions queue with Approve / Request changes / Mark as posted, notes, trilingual post viewer, fact archive, a "Generate new edition" button, and one-tap Telegram publishing. Replaces the old Claude Artifact newsroom (`claude.ai/artifact/5EqRF3KSQAGLTh3i93yGRH`), which is no longer the source of truth.
- API base: `https://sikke-newsroom-api.etemadansari-ardalan.workers.dev`. Mini App: `https://sikke-newsroom.etemadansari-ardalan.workers.dev`.
- Schema, auth and rules: `.claude/skills/sikke-editor/references/newsroom.md`. Do not use `ArtifactData` for this any more.
- Source code: `telegram-miniapp/` in this repo (also pushed to the public GitHub repo `ardalanea/sikke-desk-project`, which a scheduled cloud routine clones to run unattended editorial cycles queued from the Mini App).
- Never set an edition's status to approved or posted yourself — except actually publishing to Telegram, which the Mini App's "Publish" button does directly via the Worker (still only ever on Ardalan or Niloofar's tap, never automatically).

## Local working copy (`sikke/`)

- `sikke/archive/fact-archive.csv` — verified facts (mirror of the newsroom `cards` collection).
- `sikke/cards/` — verified card files; `sikke/cards/draft/` — 17 unverified draft cards from test run 01 (region, cons, oddities) waiting for a stock check.
- `sikke/editions/` — edition 01 (Tabriz 1294) in EN, FA, TR, the approved combined pack, and the standards report.

## Other references

- `HANDOFF.md` — what has been done and what is next.
- `plugin/sikke-desk.plugin` — the same team packaged as a Cowork plugin (v0.3.0); `plugin/sikke-desk-source/` is its source.
- `docs/` — HTML sources of the blueprint, the test-edition review page and the newsroom page.
