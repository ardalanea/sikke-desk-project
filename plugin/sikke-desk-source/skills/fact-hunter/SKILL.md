---
name: fact-hunter
description: Research method for Sikke's beat reporters — how to dig up surprising, true, well-sourced facts and stories about money, banking, fraud, crypto, financial crises and frozen money in any era or region, and return them as fact cards. Use when asked to "find facts about", "dig into", "research the history of" any money topic, or when a Sikke reporter agent starts an assignment.
---

# Fact Hunter

Find facts a smart reader has never heard, that are true, and that can be proven with sources.

## Before searching

1. Read your beat brief in `references/beats/<beat>.md` (antiquity, empires-crashes, cons-heists, crypto, money-lock, oddities-myths, region, wire).
2. Read `references/source-library.md` for where to confirm facts.
3. Note the headlines already in the archive (the editor passes them) so you do not return duplicates.

## How to dig

- **Start wide, then go to the source.** Use encyclopedias, listicles, Reddit or YouTube only to find leads. Then confirm each lead in an institutional, academic, museum, court/regulator, or established-press source.
- **Search in three languages.** Run key queries in English, Turkish and Farsi. Regional stories often exist only in local sources (Turkish press archives, Persian history sites, Cypriot newspapers). Record which language each source is in.
- **Hunt the surprising detail.** For every story ask: what is the one detail people won't believe? A number, a coincidence, an absurd rule, a twist in how it was caught. That detail is the card's headline.
- **Get the numbers right at the source.** Record the original amount and currency, the date of that amount, and where the figure came from. Do not convert yourself; leave conversion to `money-converter`.
- **Capture the human.** Who did it, who lost, who noticed. Record the legal outcome exactly (charged, convicted, acquitted, settled, died before trial).
- **Look for the twist and the echo.** A link to today ("the same trick as a 2026 crypto scam") makes a history fact postable.

## Search patterns that work

- "<topic> museum" / "<topic> site:.ac.uk OR site:.edu" / "<topic> central bank history"
- "<scheme name> SEC litigation release" / "<name> sentenced DOJ"
- "<event> newspaper <year>" (Chronicling America, Trove, Internet Archive)
- Turkish: "<konu> tarihi", "ilk banknot", "dolandırıcılık davası", "Osmanlı para"
- Farsi: "تاریخچه <موضوع>", "کلاهبرداری", "اسکناس", "بانک شاهنشاهی"

## Regional quota

Every desk, whatever its beat, returns at least one card linked to Iran, Türkiye, Cyprus or the wider Middle East when any exists (run at least two searches in Farsi and two in Turkish to look). If none is found, say so and list the searches tried.

## What to return

5–10 cards in the `fact-card` format, best first. Status is always `Draft` from a reporter; only the fact-checker sets Verified. Include for each card at least one source URL you actually opened. Add a short "leads not pursued" list for the editor. Never invent a source, a quote, a date or a figure; when a detail is uncertain, write "unclear" and say why.
