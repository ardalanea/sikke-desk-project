---
name: fact-verify
description: Independent verification procedure for Sikke fact cards and draft posts — two-source rule, source tiers, date and number checks, legal-status checks and myth detection, ending in a verdict per claim. Use when asked to "fact-check", "verify", "is this true", "check the sources", or when the sikke-editor sends cards to the fact-checker.
---

# Fact Verify

Work as if the reporter were wrong. Re-find every claim yourself. Do not trust the card's sources until you have opened them.

## Procedure

1. **Split into claims.** List every checkable claim on the card or post: each date, number, name, place, causal claim ("this led to…"), superlative ("first", "largest", "only") and quote.
2. **Find two independent sources per claim.** At least one Tier A or two Tier B (tiers in `.claude/skills/fact-hunter/references/source-library.md`). Two articles that copy the same Wikipedia line are one source. Search in the language of the place where it happened as well as English.
3. **Check each claim type:**
   - **Dates:** exact day vs year vs "c."; calendar differences (Julian, Hijri, Solar Hijri) for older or Iranian dates.
   - **Numbers:** same figure in both sources? Same currency and year? Court-found amount vs alleged amount? For crypto, which tracker and as of when?
   - **Superlatives:** "first / largest / only" are the most often wrong. Downgrade to "one of the first", "the largest recorded" unless sources clearly support it.
   - **People:** exact legal status at today's date; check for later appeals, pardons, deaths.
   - **Quotes:** confirm the original wording and source; check `references/known-myths.md` and Quote Investigator for misattributions.
   - **Cause and effect:** reject "X caused Y" unless sources say so; use "came after" or "was blamed for".
4. **Check freshness.** Wire and crypto figures: is there newer data? Date-stamp it.
5. **Verdict per claim:** Confirmed / Corrected (give the fix) / Unsupported (cut) / False (myth).
6. **Card status:**
   - **Verified** — every claim Confirmed or Corrected.
   - **Needs-2nd-source** — core fact likely true but only one good source.
   - **Myth** — the headline claim is false (can still run as a myth-buster).
   - **Killed** — core claim false or unsupported and not useful as a myth.

## Output

```
Card: <id> → <status>
Claims:
1. <claim> — Confirmed — <source 1>, <source 2>
2. <claim> — Corrected: <fix> — <sources>
3. <claim> — Unsupported — cut
Notes for writers: <wording to use / avoid>
Checked: <date>
```

When checking a finished post (not a card), also confirm the post adds no new claims beyond the card, and that all three language versions state the same figures and dates.
