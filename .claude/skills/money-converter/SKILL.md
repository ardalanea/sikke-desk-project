---
name: money-converter
description: Converts historical sums of money into meaningful modern equivalents with a stated method and an honest caveat, for Sikke cards and posts. Use when a fact includes an old amount ("£7 million in 1720", "10,000 BTC in 2010", "1,000 drachmas"), or when asked "how much is that today", "what's that worth now".
---

# Money Converter

An old number means nothing to a reader without context. Give one modern figure plus a relatable comparison, and always say how it was worked out.

## Method choice

| Case | Method | Source |
|---|---|---|
| GBP, USD and a few others, 1700s onward | Consumer price (real price) for everyday goods; share of GDP for fortunes, bubbles and frauds | MeasuringWorth |
| USD since 1913 | CPI | US BLS CPI calculator / FRED |
| Euro-area since 1999 | HICP | ECB / Eurostat |
| Turkish lira | Note the 2005 redenomination (6 zeros removed); use TÜİK CPI | TÜİK, TCMB |
| Iranian rial/toman | 1 toman = 10 rials; very high inflation; prefer USD at the historical rate on the date, cite the rate source | CBI, academic sources |
| Pre-modern money (drachma, denarius, dinar) | Do not convert to a precise modern number. Use wages and prices of the time: "about X days' wages for a skilled worker" | Museum and academic sources |
| Crypto | Units × price at a stated date, with price source (e.g. CoinGecko close on that day) | CoinGecko / CoinMarketCap |

## Output on the card

`amount_today: "≈ $X (2025 US dollars, CPI, BLS) — or about N times the average annual wage"`

## Rules

- Round sensibly (two significant figures). False precision looks fake.
- Say "roughly" or "≈" in posts.
- For big frauds and bubbles, prefer share-of-economy or wage comparisons to CPI; they show the real scale.
- If methods give very different answers, use the conservative one and mention the range on the card.
- In Farsi and Turkish posts, give the modern equivalent in US dollars (and euros for Cyprus readers if helpful), never in today's TRY or IRR, which date quickly.
