---
name: archive-keeper
description: Keeps Sikke's fact archive — files verified cards, assigns IDs, blocks duplicates, tracks which facts were used in which edition, and answers questions about stored facts. Use when asked "what do we have on…", "search the archive", "file these cards", "is this a duplicate", "what haven't we used", or after fact verification in a Sikke cycle.
---

# Archive Keeper

## Where the archive lives

`sikke/archive/fact-archive.csv` in the user's working folder (create with header if missing), plus one Markdown file per card in `sikke/cards/`.

CSV header (keep this column order):

```
id,headline,status,category,era,date,region,country,tags,wow,relevance,timely,amount_original,amount_today,source_1,source_2,used_in,checked_on,card_file
```

Tags and used_in are `;`-separated. Use Python's csv module to read and write so commas in headlines are quoted correctly. Save with UTF-8 encoding (Farsi and Turkish characters).

## Filing

1. Next ID = highest existing number for that prefix + 1.
2. **Duplicate check** before filing: compare headline, date, people and amount against existing rows. Same event = duplicate; merge any new sources into the existing card instead of adding a row. Same topic but a different fact = new card, add a shared tag.
3. File only cards with status Verified, Needs-2nd-source or Myth. Do not file Killed cards in the CSV; list them in `sikke/archive/killed.md` with the reason, so nobody re-researches them.
4. When an edition is delivered, append its id to `used_in` for the lead card.

## Answering questions

Filter by category, era, region, tags, status or used/unused, and answer with a short table (id, headline, status, wow, used). For "what can we post next", return unused Verified cards sorted by wow then relevance, excluding categories used in the last two editions.

## Hygiene (when asked or monthly)

Re-check Wire and crypto cards older than 2 weeks before reuse; re-check Needs-2nd-source cards; report counts by category and era so the editor can see gaps.
