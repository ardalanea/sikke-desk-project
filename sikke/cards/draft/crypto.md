# Crypto & Fintech desk — draft cards (edition 02 research, leftover stock)

Reporter: crypto-reporter. CRY-0002 was used as an edition 02 alternate (filed in sikke/cards/CRY-0002.md). These are the rest: not yet fact-checked.

---
id: CRY-0001
headline: September 2026 was crypto's worst month on record for hacks — roughly $768 million stolen in a single month
status: Draft
category: crypto-fintech
era: digital
date: "2026-09"
region: global-online
country: Global
tags: [crypto hacks, PeckShield, CertiK, Bitget, Liquid Network, security, 2026]
people: []
amount_original: "$766.5M across 55 incidents (PeckShield, Sept 2026); $768.4M across 97 incidents (CertiK, Sept 2026) — trackers disagree on count and total"
amount_today: ""
wow: 4
relevance: 3
timely: news-peg
formats: [channel, carousel, linkedin]
visual: "Simple bar chart, monthly crypto hack losses through 2026, spike in September; no coin/exchange logos"
sources:
  - title: "Crypto Hack Losses Hit $768M in September"
    url: "https://cointelegraph.com/news/crypto-hacks-total-766m-in-september-peckshield"
    tier: B
    lang: en
  - title: "Crypto loses $768M in worst hack month of 2026"
    url: "https://crypto.news/crypto-loses-768m-in-worst-hack-month-of-2026/"
    tier: B
    lang: en
used_in: []
checked_by: ""
---

**Fact:** September 2026 was the worst month for crypto hacks and exploits in the year's record so far. Security tracker PeckShield counted 55 major incidents totalling $766.5 million; rival tracker CertiK counted 97 incidents and put the loss at $768.4 million. Two breaches accounted for most of it: a $388 million hack of exchange Bitget (Sept 24) and a $320 million exploit of Blockstream's Liquid Network (Sept 6), of which more than $270 million was later given back by the attacker.

**The surprising detail:** two trackers watching the same month, using different methodologies, land within about $2 million of each other on the total — but disagree by 42 incidents on the count.

**Echo today:** none beyond the month itself; see the Bitget and Liquid Network cards for the two headline incidents.

**Uncertain points:** "worst month on record" is PeckShield's and CertiK's own framing for 2026 year-to-date, not an all-time claim across crypto's history. Good context/overview card — useful paired with CRY-0002 (Bitget, now filed) as a stat sidebar.

---
id: CRY-0003
headline: Hackers stole $319 million in Bitcoin from Blockstream's Liquid Network, then negotiated the return of 85% of it on the blockchain itself
status: Draft
category: crypto-fintech
era: digital
date: "2026-09-06"
region: global-online
country: Global (Blockstream / Liquid Network)
tags: [Liquid Network, Blockstream, Bitcoin sidechain, white hat, rangeproof bug, 2026]
people: []
amount_original: "≈4,000 L-BTC / ≈$319,000,000 minted and drained Sept 6 2026, 13:53 UTC; 3,400 BTC / ≈$272,000,000 returned Sept 7 2026, 16:09 UTC; ≈602 BTC / ≈$47,000,000 retained by the attacker"
amount_today: ""
wow: 5
relevance: 3
timely: news-peg
formats: [channel, carousel, linkedin]
visual: "Before/after bar showing stolen vs returned BTC; avoid implying endorsement of the attacker"
sources:
  - title: "Liquid Network Security Incident Assessment"
    url: "https://blog.blockstream.com/liquid-network-security-incident-assessment/"
    tier: A
    lang: en
  - title: "2026's Biggest Hack To Date: Attackers Drained USD 319 Million in Bitcoin From Liquid Network, Then Returned 85% of Funds"
    url: "https://www.trmlabs.com/resources/blog/2026s-biggest-hack-to-date-attackers-drained-usd-319-million-in-bitcoin-from-liquid-network-then-returned-85-of-funds"
    tier: B
    lang: en
used_in: []
checked_by: ""
---

**Fact:** On September 6, 2026, an attacker exploited two linked bugs in the rangeproof-verification cache of Elements (the Bitcoin Core fork underlying Blockstream's Liquid Network sidechain) — one dating to April 2018 — to mint about 4,000 L-BTC with no real Bitcoin backing it, then moved it off-chain through a legitimate peg-out process, worth about $319 million. The attackers, who called themselves white hats, communicated with Blockstream through on-chain messages. After Blockstream shipped a hardened fix, the attackers returned 3,400 of the 4,000 BTC on September 7 — about 85% — keeping roughly 602 BTC (≈$47 million).

**The surprising detail:** the "negotiation" over giving the money back happened in public, written directly onto the Bitcoin blockchain, instead of through lawyers or a bug-bounty platform.

**Echo today:** a modern echo of "white hat" rescue hacks like the 2016 Robin Hood Group response to The DAO — except this time the thieves set their own terms for a partial return.

**Uncertain points:** the attackers' "white hat" framing is self-described, not verified; ≈602 BTC (≈$47M) was never returned, which sits oddly with an altruistic motive. Flag as an unresolved claim, not a confirmed white-hat story.

---
id: CRY-0004
headline: Bitget's hacker moved $83 million in stolen XRP that not even Ripple can freeze
status: Draft
category: crypto-fintech
era: digital
date: "2026-09-26–2026-09-28"
region: global-online
country: Global
tags: [XRP, Ripple, Bitget, asset freeze, stablecoin blacklist, 2026]
people: []
amount_original: "≈103,000,000 XRP stolen; ≈$83,000,000 moved Sept 26–28 2026; by contrast, Circle and Tether froze ≈$320,000 in stolen stablecoins from the same breach"
amount_today: ""
wow: 4
relevance: 3
timely: news-peg
formats: [channel, carousel, linkedin]
visual: "Side-by-side icon comparison: frozen padlock on a stablecoin vs open padlock on XRP"
sources:
  - title: "Bitget hacker moves $83 million in stolen XRP that Ripple cannot freeze"
    url: "https://www.coindesk.com/markets/2026/09/26/bitget-hacker-moves-usd83-million-in-stolen-xrp-that-ripple-cannot-freeze"
    tier: B
    lang: en
used_in: []
checked_by: ""
---

**Fact:** Among the assets taken in the September 24, 2026 Bitget hack was roughly 103 million XRP. Over the following days the attacker moved about $83 million of it out of holding wallets — and there was nothing Ripple or anyone else could do to stop it. The XRP Ledger lets companies freeze tokens they themselves issue on it, but that power does not reach XRP, the network's own native currency. In the same incident, Circle and Tether used their built-in blacklist functions to freeze about $320,000 of stolen USDC and USDT — a tiny fraction of the loss, but money a thief can't touch.

**The surprising detail:** the two freeze-proof and freezable assets in the same heist were the opposite of what casual intuition about crypto "control" might suggest.

**Echo today:** a clean, concrete illustration for explaining why "stablecoin" and "freezable" often mean the same thing, while a blockchain's own native coin usually does not.

**Uncertain points:** figures are from a single Tier B source tracking wallet movements during a fast-moving event; exact final totals may be revised. Good pairing/sidebar for the Bitget story (CRY-0002, filed).

---
id: CRY-0005
headline: Turkey's BtcTurk was hacked three times in 19 months — and all three times it was the same hot wallets
status: Draft
category: crypto-fintech
era: digital
date: "2024-06–2026-01"
region: turkiye-cyprus
country: Türkiye
tags: [BtcTurk, Türkiye, exchange hack, hot wallet, repeat breach]
people: []
amount_original: "≈$55,000,000 (June 2024); ≈$48,000,000 (Aug 14 2025, per Halborn/Cryptonomist's contemporaneous Aug-2025 report — a later Cryptonomist recap gives $38M for the same incident, sources disagree); ≈$48,000,000 (Jan 1 2026) — combined total ≈$141–151M depending which Aug-2025 figure is used"
amount_today: ""
wow: 4
relevance: 5
timely: evergreen
formats: [channel, carousel, linkedin]
visual: "Simple repeating-icon timeline: three hack dates on one line, same hot-wallet icon each time"
sources:
  - title: "Explained: The BtcTurk Hack (August 2025)"
    url: "https://www.halborn.com/blog/post/explained-the-btcturk-hack-august-2025"
    tier: B
    lang: en
  - title: "Btcturk hack: Turkey exchange hit again amid $48M theft"
    url: "https://en.cryptonomist.ch/2026/01/05/btcturk-hack-turkey-exchange/"
    tier: B
    lang: en
used_in: []
checked_by: ""
---

**Fact:** Turkey's BtcTurk, the country's largest crypto exchange, was hacked three times in under two years: about $55 million from ten hot wallets in June 2024 (private-key compromise), roughly $48 million from hot wallets across seven chains in August 2025, and another roughly $48 million from hot wallets on Ethereum, Arbitrum and Polygon on January 1, 2026. Each time, BtcTurk said customer funds were unaffected because the bulk of assets sit in cold wallets, and each time Binance helped trace and freeze a small slice of the stolen funds while trading resumed within days.

**The surprising detail:** the exchange's own post-incident statement was functionally identical all three times — only the hot-wallet balance and the date changed.

**Echo today:** a ready-made illustration of why "my exchange says my funds are safe" and "my exchange has never lost money from a hot wallet" are two very different promises.

**Uncertain points:** the August 2025 loss figure is disputed between sources ($48M vs $38M for the same incident). Needs a third source (e.g. BtcTurk's own statement) to resolve before publishing an exact combined total. High relevance (Türkiye) — a strong candidate for a future regional edition once resolved.

---
id: CRY-0006
headline: A Tehran man was murdered by a friend who knew he held 20 billion tomans in Bitcoin — the wallet's fate died with him
status: Draft
category: money-lock
era: digital
date: "c. 2022 (court proceedings reported Oct 2023)"
region: iran-middle-east
country: Iran
tags: [Iran, Tehran, Bitcoin, murder, lost wallet, qisas, Farsi press]
people:
  - "Defendant named Ramin by Etemad Online / Siyavash by Rokna.net (likely the same person under different press aliases — unresolved) — status: convicted, sentenced to qisas (execution); Supreme Court overturned the sentence and remanded the case for retrial citing investigative defects and the unclear status of the bitcoins"
  - "Co-defendant named Farzad (Etemad Online, sentenced 10 years) / Hamid (Rokna.net, sentenced 25 years, upheld by Supreme Court) — same unresolved naming/sentence discrepancy"
amount_original: "20,000,000,000 Iranian tomans (reported value of the victim's Bitcoin wallet at the time of the case, exact date unclear)"
amount_today: ""
wow: 5
relevance: 5
timely: evergreen
formats: [channel, linkedin]
visual: "Abstract/non-graphic treatment only — a locked wallet icon, no crime-scene imagery, given the violent nature of the underlying case"
sources:
  - title: "مجازات قصاص؛ تاوان سرقت مرگبار ۲۰ میلیارد تومان بیت‌کوین"
    url: "https://www.etemadonline.com/بخش-حوادث-68/643607-حکم-قصاص-سرقت-بیت-کوین"
    tier: B
    lang: fa
  - title: "گره کور ۲۰ میلیارد تومان دارایی دیجیتال در پرونده قتل مرد تهرانی"
    url: "https://www.rokna.net/بخش-حادثه-245/1208577"
    tier: B
    lang: fa
used_in: []
checked_by: ""
---

**Fact:** In a Tehran murder case reported in the Persian press, a man was kidnapped and tortured by an acquaintance who knew he held a Bitcoin wallet reportedly worth 20 billion tomans, in an attempt to extract the wallet's password. The victim did not give it up; he was shot and buried in a garden near Damavand. The primary defendant was sentenced to qisas (execution) by a Tehran criminal court; Iran's Supreme Court later overturned that sentence and sent the case back for retrial, citing, among other issues, the unresolved status of the bitcoins. The wallet itself was never recovered.

**The surprising detail:** in a case built entirely around a cryptocurrency fortune, the money itself vanished as completely as if it had never existed.

**Echo today:** the starkest possible illustration of "not your keys, not your coins" cutting the other way.

**NOT READY — editor hold:** two Persian-language sources give different first names for both defendants and different sentence lengths for the co-defendant; may be the same case under press-anonymization aliases, or two different cases. Needs a third, ideally official, source before verification. Involves graphic violence and a death sentence under appeal — standards-editor must review tone, independent of the regional-politics question (this is a criminal case, not Iran politics/sanctions, but still warrants care).

---
id: CRY-0007
headline: A man spent over a decade fighting to dig up a landfill for 8,000 Bitcoin he'd thrown away by accident — and lost
status: Draft
category: money-lock
era: digital
date: "2013–2025"
region: europe
country: United Kingdom (Wales)
tags: [James Howells, lost wallet, landfill, Newport, UK High Court, hard drive]
people:
  - "James Howells (claimant; no criminal case — civil claim against Newport City Council; High Court dismissed the claim Jan 9 2025; Court of Appeal refused permission to proceed March 2025)"
amount_original: "8,000 BTC lost in a 2013 household clear-out; claim's Bitcoin valued at ≈£617,000,000 as of the Jan 2025 ruling date (court's own figure)"
amount_today: ""
wow: 4
relevance: 2
timely: evergreen
formats: [channel, carousel, linkedin]
visual: "Landfill site illustration, no identifiable individuals"
sources:
  - title: "James Howells v Newport City Council (2025)"
    url: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2025/22"
    tier: A
    lang: en
  - title: "High Court dismisses claim against council over hard drive containing password to £600m bitcoin wallet dumped at landfill site"
    url: "https://www.localgovernmentlawyer.co.uk/litigation-and-enforcement/400-litigation-news/59612-high-court-dismisses-claim-against-council-over-hard-drive-containing-password-to-600m-bitcoin-wallet-dumped-at-landfill-site"
    tier: B
    lang: en
used_in: []
checked_by: ""
---

**Fact:** In 2013, James Howells' partner discarded a hard drive during a household clear-out; it held the private key to a wallet holding 8,000 Bitcoin, worthless pocket change at the time. The drive ended up at Newport City Council's landfill in Wales. Howells spent over a decade trying to get permission to excavate the site before finally suing. In January 2025, the High Court threw the claim out: under Section 14(6) of the UK's Control of Pollution Act 1974, anything deposited at a licensed landfill belongs to the site operator; the judge also held Bitcoin itself can't physically "be" in a landfill — only the hard drive could. The Court of Appeal refused permission to appeal in March 2025.

**The surprising detail:** the case turned on a 1974 pollution-control law written decades before Bitcoin existed.

**Echo today:** the textbook cautionary tale cited whenever someone argues the biggest risk in crypto is the exchange, not yourself.

**DUPLICATE NOTE:** the Money Lock desk independently filed the same story as LCK-0003 (see sikke/cards/draft/money-lock.md) — archive-keeper should treat these as one card and keep whichever write-up is stronger when this story is next picked up; don't file both.

**Uncertain points:** the Bitcoin's value is quoted differently across outlets depending on the BTC price and date used; money-converter should confirm and pick one dated valuation rather than average sources.
