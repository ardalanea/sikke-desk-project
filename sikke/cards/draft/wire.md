# Wire desk — draft cards (edition 02 research, leftover stock)

Reporter: wire-reporter. WIR-0002 was used as edition 02's lead (filed in sikke/cards/WIR-0002.md). These are the rest: not yet fact-checked.

---
id: WIR-0001
headline: The SEC says a fake "AI trading bot" ring ran entirely out of WhatsApp group chats and froze withdrawals until victims paid a fee
status: Draft
category: cons-fraud
era: digital
date: "2026-09-29"
region: global-online
country: "unclear (entities registered offshore; SEC complaint names operators as unidentified, likely overseas)"
tags: [SEC, WhatsApp, AI trading bot, crypto fraud, Cryptoaiml, litigation release]
people: ["Cryptoaiml Ltd. (charged, civil fraud complaint, SEC v. Cryptoaiml Ltd. et al., SDNY, filed 2026-09-29 — not convicted)", "Cryptoaiml Capital Foundation (charged, same complaint — not convicted)"]
amount_original: "more than $12,500,000 (August 2024–March 2025), from over 300 investors, per SEC complaint"
amount_today: ""
wow: 4
relevance: 3
timely: news-peg
formats: [channel, carousel, linkedin]
visual: "SEC seal / courthouse exterior SDNY; stylised WhatsApp chat bubble with a fake 'AI signal' — avoid implying any specific real chat screenshot; stock/editorial image only"
sources:
  - title: "SEC Charges Multiple Entities in Fraud Schemes Totaling at Least $15 Million That Used WhatsApp, Other Platforms (Press Release 2026-95)"
    url: "https://www.sec.gov/newsroom/press-releases/2026-95-sec-charges-multiple-entities-fraud-schemes-totaling-least-15-million-used-whatsapp-other-platforms"
    tier: A
    lang: en
  - title: "SEC Litigation Release LR-26654 (SEC v. Cryptoaiml Ltd. and Cryptoaiml Capital Foundation, SDNY, Case No. 26-civ-08508)"
    url: "https://www.sec.gov/enforcement-litigation/litigation-releases/lr-26654"
    tier: A
    lang: en
used_in: []
checked_by: ""
---

**Fact (40–120 words, plain, no hype):** On 29 September 2026 the US SEC filed a civil fraud complaint against Cryptoaiml Ltd. and Cryptoaiml Capital Foundation in the Southern District of New York. The SEC alleges that from August 2024 to March 2025 the operators ran WhatsApp group chats, posing as professional traders and posting fake "AI-generated" trading signals, then directed more than 300 investors to a trading platform where no real trades occurred — profits shown on screen were fabricated. The complaint seeks injunctions, disgorgement and civil penalties. The entities have not been convicted of anything; this is a civil enforcement complaint, not a criminal charge.

**The surprising detail:** When investors tried to withdraw their (fictitious) profits, they were told their account was frozen — and that they had to pay a fee to unlock it. Classic advance-fee con, dressed in 2026's AI branding.

**Echo today:** The "frozen until you pay a release fee" trick is one of the oldest moves in the advance-fee playbook — only the bait (an AI bot instead of a Nigerian prince or a lottery win) has changed.

**Uncertain points:** The SEC complaint describes the operators only as unidentified/likely based overseas; no individual has been named or charged. "More than 300 investors" and the $12.5M figure are the SEC's own allegations, not yet tested in court — the case is pending.

Note: companion case to WIR-0002 (TSAI Pro), filed by the SEC the same day — see that card (now filed, sikke/cards/WIR-0002.md) for the fake-certificate/Form D angle used as edition 02's lead.

---
id: WIR-0003
headline: A single hack drained $351.6 million from crypto exchange Bitget — without ever touching its private keys
status: Draft
category: crypto-fintech
era: digital
date: "2026-09-24"
region: global-online
country: "unclear (Bitget registered in Seychelles; attackers unidentified)"
tags: [Bitget, crypto hack, North Korea, hot wallet, 2026 hacks, spoofed transfer]
people: []
amount_original: "about $351,600,000 (later estimates up to ~$387,500,000) detected 24 September 2026, 18:31 UTC"
amount_today: ""
wow: 4
relevance: 3
timely: news-peg
formats: [channel, carousel]
visual: "Abstract exchange/hot-wallet network diagram; avoid any Bitget logo use without licence check"
sources:
  - title: "Bitget Says Suspected North Korean Hackers Stole $351.6M After Backend Compromise"
    url: "https://thehackernews.com/2026/09/bitget-says-suspected-north-korean.html"
    tier: B
    lang: en
  - title: "Bitget's $351 million hack happened via spoofed transfers, not private keys, CEO Gracy Chen says (CoinDesk)"
    url: "https://www.coindesk.com/markets/2026/09/25/bitget-s-usd351-million-hack-happened-via-spoofed-transfers-not-private-keys-ceo-gray-chen-says"
    tier: B
    lang: en
used_in: []
checked_by: ""
---

**Fact (40–120 words, plain, no hype):** On 24 September 2026, crypto exchange Bitget detected unauthorised transfers from some of its hot and warm wallets totalling about $351.6 million (later estimates rose toward $387.5 million after stolen assets were traced on other chains). CEO Gracy Chen said the attackers never obtained Bitget's private keys; instead they compromised a wallet backend and spoofed transaction data to trigger the exchange's own authorisation process. Bitget says customer balances are unaffected and the loss is covered by its $464M+ User Protection Fund. Mandiant and SlowMist are investigating; suspected North Korea-linked actors have been named by investigators, not confirmed by any government.

**The surprising detail:** The thieves didn't need to steal a single cryptographic key — they tricked the exchange's own systems into approving transfers by faking the data the systems trusted.

**Echo today:** 2026 is already the costliest year for crypto hacks on record, per DeFiLlama tracking — this is the largest single incident of the year so far.

**Uncertain points:** The North Korea attribution is Bitget/investigators' working assessment, not an independently confirmed government finding. No individual or entity has been criminally charged in connection with this hack as of this writing.

Note: same underlying Bitget hack as CRY-0002 (filed, sikke/cards/CRY-0002.md), which carries more verified narrative detail (the probe-transfer mechanic) — prefer CRY-0002 as the fuller version; keep this one only if a shorter/different angle is wanted.

---
id: WIR-0004
headline: Turkey's regulator ordered 131 investment funds liquidated and investigated 217 people in an $18 billion market-manipulation scandal
status: Draft
category: cons-fraud
era: digital
date: "2026-09-17"
region: turkiye-cyprus
country: Türkiye
tags: [SPK, Turkey, investment fund scandal, market manipulation, Tera Portföy, Capital Markets Board]
people: ["Emre Tezmen, chairman of Tera Yatırım Menkul Değerler (arrested and remanded in pre-trial custody — not convicted, per Reuters)"]
amount_original: "about $18 billion in fund assets under liquidation; 455,758 individual investors affected (Reuters); 131 funds ordered liquidated 17 September 2026; arrest warrants issued for 217 suspects, at least 45 already detained (as of late September 2026)"
amount_today: ""
wow: 4
relevance: 5
timely: news-peg
formats: [channel, carousel, linkedin]
visual: "Borsa Istanbul ticker / abstract falling-chart graphic; avoid any individual's photo given ongoing legal proceedings"
sources:
  - title: "Turkey widens fund scandal probe, over 200 suspects investigated (Reuters, via Yahoo Finance)"
    url: "https://finance.yahoo.com/markets/stocks/articles/turkey-widens-fund-scandal-probe-151837848.html"
    tier: B
    lang: en
  - title: "Fon soruşturmasında blokeler kalktı (Euronews Türkçe)"
    url: "https://tr.euronews.com/2026/09/28/fon-sorusturmasinda-blokeler-kalkti-ak-parti-baskan-yardimcisi-hisse-iddiasiyla-istifa-ett"
    tier: B
    lang: tr
used_in: []
checked_by: ""
---

**Fact (40–120 words, plain, no hype):** After Turkey's Capital Markets Board (SPK) tightened fund rules on 28 August 2026, a wave of withdrawals forced several funds to dump illiquid, low-volume stocks, some of which had risen as much as 100-fold beforehand. Turkish shares fell sharply on 15–16 September. On 17 September the SPK ordered 131 funds run by seven portfolio managers — including Tera Portföy, Pusula Portföy and Hedef Portföy — liquidated, affecting over 455,000 investors and about $18 billion in assets. Istanbul prosecutors are investigating suspected market manipulation, capital-markets-law violations and criminal organisation; arrest warrants have been issued for 217 suspects, with at least 45 detained, including Tera chairman Emre Tezmen, who was arrested and remanded in custody.

**The surprising detail:** Some of the implicated stocks had risen roughly 100x before the crash — a scale of alleged manipulation unusual even for a Borsa Istanbul known for retail speculation.

**Echo today:** A fast regulatory tightening that triggers a liquidity-driven selloff, followed by a fraud investigation, is a pattern seen in other markets after sudden rule changes — worth a possible "echo" comparison for the editor to source separately.

**Uncertain points:** This story has touched Turkish domestic politics — an AKP deputy chair, Fatma Betül Sayan Kaya, resigned after allegations she sold shares before the crash; her own legal status (charged, investigated, or neither) was not confirmed in sources opened for this card, so she is deliberately left off the card's people field.

**FLAGGED:** Per the standing "Open decision" in CLAUDE.md on sensitive regional politics (Turkish domestic politics), this needs Ardalan/Niloofar sign-off before any post references the political angle at all — the financial-fraud facts above are sourced independently of that angle and could potentially run on their own with the political thread left out entirely, but that's still an editorial call, not a default.

---
id: WIR-0005
headline: Cyprus's central bank fined a Swiss-owned bank €750,000 for anti-money-laundering failures found three years ago
status: Draft
category: banking
era: digital
date: "2026-09-29"
region: turkiye-cyprus
country: Cyprus
tags: [Central Bank of Cyprus, AML, Banque SBA Cyprus, regulatory fine]
people: []
amount_original: "€750,000 (2026), fine imposed by the Central Bank of Cyprus"
amount_today: ""
wow: 2
relevance: 4
timely: news-peg
formats: [channel]
visual: "Central Bank of Cyprus building, Nicosia — check photo licence; or abstract AML/compliance graphic"
sources:
  - title: "Central Bank slaps €750,000 fine on Banque SBA Cyprus (Cyprus Mail)"
    url: "https://cyprus-mail.com/2026/09/30/central-bank-slaps-e750000-fine-on-banque-sba-cyprus"
    tier: B
    lang: en
  - title: "NEWS: Cyprus central bank fines Banque SBA €750,000 over AML breaches (AML Intelligence)"
    url: "https://www.amlintelligence.com/2026/09/news-cyprus-central-bank-fines-banque-sba-e750000-over-aml-breaches/"
    tier: B
    lang: en
used_in: []
checked_by: ""
---

**Fact (40–120 words, plain, no hype):** The Central Bank of Cyprus announced on 29 September 2026 a €750,000 fine against Banque SBA Cyprus for breaches of the island's 2007 anti-money-laundering law and the central bank's AML/counter-terrorist-financing directive. The fine follows findings from an inspection carried out in 2023 — a three-year gap between the inspection and the published penalty. No individual has been named or charged; this is a regulatory administrative fine against the institution, not a criminal case.

**The surprising detail:** The gap between the 2023 inspection and the 2026 fine — three years — is itself a small window into how slowly bank AML enforcement can move even in a jurisdiction, Cyprus, whose banking sector has been repeatedly scrutinised for money-laundering risk.

**Echo today:** none identified yet — worth checking whether Banque SBA or Cyprus AML enforcement has a deeper history for a future card.

**Uncertain points:** Available sources did not specify which exact AML controls were deficient. "Three years" is calculated from the stated 2023 inspection date to the 2026 fine announcement; the exact inspection month was not found.

---
id: WIR-0006
headline: Australia's central bank just raised rates to their highest level in nearly 15 years
status: Draft
category: money-news
era: digital
date: "2026-09-29"
region: southeast-asia-oceania
country: Australia
tags: [RBA, interest rates, monetary policy, inflation]
people: []
amount_original: "cash rate target raised from 4.35% to 4.60% (29 September 2026), highest since November 2011"
amount_today: ""
wow: 2
relevance: 2
timely: news-peg
formats: [channel]
visual: "Simple rate-chart graphic, RBA building Sydney (check licence)"
sources:
  - title: "RBA lifts interest rates to highest level in 15 years (ABC News)"
    url: "https://www.abc.net.au/news/2026-09-29/rba-lifts-rates-highest-level-in-15-years-september-2026/107206640"
    tier: B
    lang: en
  - title: "Australia Raises Key Rate to 4.60%, Highest in 15 Years (Seoul Economic Daily)"
    url: "https://en.sedaily.com/international/2026/09/29/australia-raises-key-rate-to-460-percent-highest-in-15-years"
    tier: B
    lang: en
used_in: []
checked_by: ""
---

**Fact (40–120 words, plain, no hype):** On 29 September 2026 the Reserve Bank of Australia's Monetary Policy Board voted unanimously to raise the cash rate target from 4.35% to 4.60% — its fourth hike of 2026 and the highest level since November 2011. The RBA cited inflation running higher than hoped, pointing to elevated energy costs and Middle East conflict as contributing pressures. Analysts estimated the rise adds roughly $107 a month to repayments on a $700,000 mortgage.

**The surprising detail:** This is Australia's fourth rate rise in a single calendar year (2026) — a pace that puts current tightening on par with the post-pandemic hiking cycle.

**Echo today:** none added — this is itself the "today" peg.

**Uncertain points:** None significant. Low wow/relevance score — likely a cut candidate or a one-line companion fact rather than a lead.
