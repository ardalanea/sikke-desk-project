---
name: story-budget
description: Plans Sikke's upcoming editions — finds money-history anniversaries, current finance news pegs and gaps in the fact archive, then proposes lead angles. Use when the user asks to "plan next week", "what should we post about", "story budget", "on this day in money history", or when the sikke-editor starts a cycle.
---

# Story Budget

Produce a short plan, not research. Output: 4–6 candidate angles per edition window, each with a desk, a peg and a one-line pitch.

## Inputs to gather

1. **Calendar pegs.** Check `references/money-calendar.md` for dates in the next 14 days. Also web-search "on this day <date> bank / currency / financial crisis / fraud" for each publish date. Treat every calendar date as a lead to verify, not a fact.
2. **News pegs.** Search the last 7 days: central bank decisions (Fed, ECB, CBRT, Central Bank of Iran), major fraud charges or sentences, crypto hacks over $10M, currency moves in TRY, IRR, EUR, record prices for coins/notes at auction. A news peg can be the hook for a history story ("this week X happened; the first time was in 1720…").
3. **Archive gaps.** From `sikke/archive/fact-archive.csv`, count categories, eras and regions used in the last 6 editions. Flag what is missing per the mix rule in `${CLAUDE_PLUGIN_ROOT}/skills/sikke-editor/references/capacity.md`.
4. **Audience moments.** Nowruz (≈20–21 March), Ramadan and Eid, Turkish and Cypriot public holidays, tax deadlines, New Year: these are good hooks for money customs stories.

## Pitch format

```
Angle: <one line, the story in a sentence>
Desk: <beat>
Peg: <date / news item / evergreen>
Why it grips: <the surprising bit>
Risk: <none / legal / political / thin sources>
```

Rank by surprise first, then peg strength. Save to `sikke/budget/budget-YYYY-MM-DD.md` when asked to plan ahead.
