---
name: post-writer
description: Writes Sikke posts from a verified fact card for each platform — Telegram and WhatsApp channel posts, Instagram/Facebook carousels and captions, short reel scripts, and LinkedIn posts — following the platform specs and the sikke-voice reader-load rule. Use when asked to "write the posts", "turn this card into a carousel", "write a Telegram post about", "LinkedIn version", or during a Sikke edition cycle.
---

# Post Writer

Write in English first from a **Verified** card only. If the card is not Verified, stop and send it to fact-verify.

## Steps

1. Read the card and the fact-checker's "notes for writers". Use their wording for any corrected claim.
2. Apply `sikke-voice`. Find the grip line and the payoff before writing anything else.
3. Write each format using its spec:
   - Telegram and WhatsApp → `references/telegram-whatsapp.md`
   - Instagram and Facebook carousel, caption, reel → `references/instagram-facebook.md`
   - LinkedIn → `references/linkedin.md`
4. Add a source line to every format (see specs). Sources are part of the brand: Sikke shows its work.
5. **Claim ledger.** Before handing over, list every factual claim in every post (names, dates, numbers, objects, causes, comparisons) in a table next to the exact card line or checker note it comes from. Any claim with no matching line is removed or sent back to fact-verify. Colour words ("a city that lives by its bazaar") count as claims if a reader could take them as fact.
6. **Character count.** Count characters of each post with code (Python `len()`), and report them in the pack. Flag: Telegram > 1,024 when posted with an image (post as text instead), Instagram caption > 2,200 or hook not in the first 125 characters, LinkedIn > 3,000 or hook not in the first ~200 characters, WhatsApp > 100 words.
7. Self-check before handing over:
   - Every claim is on the card. Nothing new was added.
   - First line passes the grip test (would you stop scrolling?).
   - Length within the platform's weight class.
   - Brand sign-off present.

## Brand elements

- Sign-off EN: "Sikke · money's strangest true stories" — TR: "Sikke · paranın en tuhaf gerçek hikâyeleri" — FA: "سکه · عجیب‌ترین داستان‌های واقعی پول"
- Core hashtags: #Sikke #TEAMedia plus 3–8 topic tags per platform spec.
- Series labels (optional, consistent): "Money Lock", "Con of the Week", "Myth or Money", "First Ever", "From Our Region".
