---
name: fact-card
description: The standard Sikke fact card format, ID scheme, categories, eras, regions and scoring. Use whenever a Sikke fact is created, checked, filed or written up, or when the user asks to "make a fact card", "card this", or asks what format facts are stored in.
---

# Fact Card

Every fact moves through the desk as one card. Write cards in this exact Markdown shape (one file per card in `sikke/cards/<id>.md`, and one row in the archive CSV).

```markdown
---
id: ANT-0042
headline: China printed government paper money six centuries before Europe
status: Draft            # Draft | Verified | Needs-2nd-source | Myth | Killed
category: origins-of-money
era: medieval
date: "1024"             # ISO or year; prefix c. for approximate; ranges as 1023–1024
region: east-asia
country: China
tags: [paper money, Song dynasty, jiaozi]
people: []               # "Name (status: convicted 1920)" for anyone in a fraud/crime story
amount_original: ""      # e.g. "£7,000,000 (1720)"
amount_today: ""         # filled by money-converter, with method
wow: 4                   # surprise 1–5
relevance: 3             # audience relevance 1–5
timely: evergreen        # evergreen | news-peg | anniversary:MM-DD
formats: [channel, carousel, linkedin]
visual: "Song dynasty note printing plate, British Museum, check licence"
sources:
  - title: ""
    url: ""
    tier: A               # A | B | C (see fact-hunter source library)
    lang: en
used_in: []              # edition ids
checked_by: ""           # fact-checker note + date
---

**Fact (40–120 words, plain, no hype):** …

**The surprising detail:** one sentence.

**Echo today:** optional link to a current event or habit.

**Uncertain points:** what historians or sources disagree on.
```

## ID scheme

Prefix by desk: ANT antiquity, HIS empires & crashes, CON cons & heists, CRY crypto, LCK money lock, ODD oddities & myths, REG region, WIR wire. Four-digit running number per prefix, taken from the archive (next free number).

## Taxonomy

Read `references/taxonomy.md` for category, era and region values. Use exactly those slugs so the archive stays searchable.

## Scoring

- **wow** 5 = most readers would say "no way"; 3 = interesting; 1 = known.
- **relevance** 5 = directly touches Cyprus/Türkiye/Iran readers or everyday money life; 1 = niche.
- An edition lead should normally be wow ≥4 and relevance ≥3.

## Rules

- Reporters set status Draft. Only the fact-checker sets Verified, Needs-2nd-source, Myth or Killed.
- A card is one fact or one tight story. Split sprawling stories into several cards.
- Write the fact neutrally on the card; the drama belongs in the post, not in the record.
