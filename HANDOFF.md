# Handoff — Sikke Desk (from the Claude chat of 1 Oct 2026)

## Done

1. **Blueprint** of the division: desks, workflow, fact-card format, categories, source library, house rules.
   https://claude.ai/artifact/5TSv9yCmayEyU2EDVQZAuG
2. **Team built**: 12 skills + 12 agents (now in `.claude/`, and as `plugin/sikke-desk.plugin` v0.3.0).
3. **Test edition 01** (Tabriz 1294, the paper money the bazaar refused): research by 3 desks (20 draft facts), independent fact-check (4 corrections to the lead), EN writing, FA/TR localisation, standards check (5 fixes). **Approved by Ardalan.** Publish date 5 Oct 2026.
   Review page: https://claude.ai/artifact/LknsKvBeG3xtz4hbyRYQg9
4. **Five improvements from the test** added to the skills: writer's claim ledger, character counts, regional quota for every desk, image-licence rule (prefer CC0: Met, Smithsonian; no British Museum images on brand channels), stock check of leftover drafts after each edition.
5. **Shared newsroom page** with database: edition 01 (approved) and 3 verified cards seeded (REG-0002, CON-0001, ODD-0001).
   https://claude.ai/artifact/5EqRF3KSQAGLTh3i93yGRH

## Posting notes for edition 01

- Farsi pun «چاو هیچ‌وقت سکه نشد» kept; Turkish "kelime-i şehadet" kept.
- English Telegram is ~1,030 characters: post as a text message, image separately.
- Slide 3: CC0 Met Museum image of a Yuan-dynasty note, captioned "The Chinese model". Label AI-made visuals "illustration".

## Next steps (suggested order)

1. Share the newsroom page with Niloofar with **edit** access (so her Approve button works). First real tap on Approve / note = first live test of the buttons.
2. Stock check: send the best ~6 of the 17 drafts in `sikke/cards/draft/` to the fact-checker and file the results.
3. Run edition 02 ("run the Sikke desk"), delivering to the newsroom.
4. Set up the twice-weekly scheduled run (pick days; notifications by push and/or email).
5. Later: connect approved Telegram posts to TEA Media's existing Telegram publishing server.
6. Decide the regional-politics policy.
7. Design production: carousel templates (Sikke look: engraving textures, ink #17262A, teal #0D5E57, gold #8E6A22, paper #EDF1EE; Bodoni-style headlines, Vazirmatn for Farsi).

## First prompt to use in Claude Code

> Read CLAUDE.md and HANDOFF.md. We're continuing the Sikke Desk. Start with next step 2 (stock check of the draft cards), then show me the plan for edition 02.
