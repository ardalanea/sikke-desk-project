# Humanizer Rules (EN / FA / TR)

Adapted from **blader/humanizer** (MIT, based on Wikipedia's "Signs of AI writing" by WikiProject AI Cleanup), **Aboudjem/humanizer-skill** (MIT, burstiness + voice profiles), and `ardalanea/story-to-content` (MIT). This is the house AI-tell checklist for every Sikke post, in every language. `sikke-voice`'s "Never" list is the short version for while you're drafting; this file is the full pass before handover.

## Why AI text sounds like AI

A model picks the most likely next choice, which fits every reader and so fits none. A human writer chooses for one reader and one subject, so their choices are uneven and specific. Every rule below removes one "default choice".

Two tests for every sentence:
1. Does it add something the reader did not already have? If not, cut it.
2. Would a careful writer do this on purpose? If not, it's a tell.

## Process

1. **Mark the tells** in the draft, strongest first (list below).
2. **Rewrite** the point directly. Keep every fact. Add no facts.
3. **Read it aloud** (mentally). Where does it still sound like a chatbot? Fix that paragraph, not just the phrase.
4. **Burstiness check:** sentence lengths must vary. Mix 3–6 word sentences with 15–25 word ones. Never three sentences of the same length in a row.

## A. Staging instead of stating (strongest; fix on one sighting)

1. **"Not X, but Y" / "It's not just X, it's Y"**: states a claim no one made to make the real one sound bigger. Say the point directly. Keep the contrast only if the reader really believes X.
   Before: *It's not just a price rise, it's a warning.* After: *The price rose 18% in a week, the fastest jump since March.*
2. **One-line dramatic closers**: "Let that sink in." "Read that again." "And that changes everything." Rows of fragments ("No plan. No money. No time."). Cut them, or merge into a sentence with a real fact.
3. **Sayings that sound deep**: "At its core…", "The real question is…", "X is the language of Y". Replace with the specific claim.
4. **Staged run-ups**: "Let's dive in", "Here's the thing", "Here's what you need to know", "Honestly?". Delete and start with the point.
5. **Arguing with no one**: "Don't get me wrong", "To be clear", "I'm not saying…". Remove unless someone actually holds that view.

## B. Rhythm by rule

6. **Forced triads**: everything in threes ("fast, simple, and powerful"). Keep only the items that add something distinct.
7. **Same sentence openings** repeated. Vary.
8. **Dashes everywhere**: final text should use no em/en dashes unless the specific post calls for one. Use periods, commas, colons, parentheses.
9. **Stacked qualifiers**: "could potentially possibly". Keep one only if needed.
10. **Uniform sentence length**: the #1 statistical tell. Vary it.

## C. Inflation

11. **AI vocabulary** (avoid, especially in clusters): delve, crucial, pivotal, landscape, realm, tapestry, testament, foster, leverage, seamless, robust, unlock, elevate, navigate, intricate, showcase, underscore, vibrant, meticulous, embark, journey (figurative), game-changer, ever-evolving, in today's fast-paced world.
12. **Inflated significance**: "marks a pivotal moment", "stands as a testament", "setting the stage for". Keep the fact, drop the importance claim.
13. **Shallow -ing riders**: "…, highlighting the importance of…", "…, reflecting a broader trend". Delete or state the real link.
14. **Sales language**: nestled, boasts, breathtaking, must-see, world-class, stunning. State what the thing is.
15. **Borrowed authority**: "experts say", "studies show" with no source. Name the source from the card or cut it — Sikke's two-source rule already requires a named source, so this should never trigger if `fact-card` was followed.
16. **Fancy verbs for is/has**: "serves as", "stands as", "boasts", "features". Use is / are / has.

## D. Formatting by rule

17. Bold on random words, a bold label on every bullet, emojis as bullet decoration, Title Case Headings. Use formatting only where it helps reading. (Platform rules in `post-writer`'s references take priority: e.g. one emoji in a Telegram post as a signpost is fine.)

## E. Chat leftovers (always remove)

18. "Great question!", "I hope this helps", "Let me know if…", "Certainly!", "Here is a…", knowledge-cutoff disclaimers, guesses presented as facts.

## What to keep (this is the human voice)

- Specific, odd, concrete details (a street name, an exact time, a real price).
- Mixed feelings, honest uncertainty, a small aside in parentheses.
- A clear opinion where the format allows it.
- Sensory detail: what you'd see, hear, pay, lose.
- Direct address ("you") for social posts.

---

## Farsi-specific tells (فارسی)

AI Farsi usually reads like a translated, bureaucratic text. Fix:

| Tell | Replace with |
|---|---|
| «در دنیای امروز»، «در عصر حاضر»، «در دنیای پرشتاب امروز» | Start with the fact itself |
| «نقش کلیدی/حیاتی ایفا می‌کند» | «مهم است چون…» + the reason, or just the fact |
| «می‌باشد» | «است» |
| «مورد بررسی قرار گرفت / مورد استفاده قرار می‌گیرد» | «بررسی شد / استفاده می‌شود» |
| «لازم به ذکر است که»، «شایان ذکر است» | Delete, say it |
| «در نهایت می‌توان گفت»، «در پایان» | End on the last concrete fact |
| «این موضوع نشان‌دهنده‌ی … است» | Say what happened, not what it "shows" |
| «نه تنها … بلکه …» used for drama | Direct statement |
| Literal English idioms («بازی را عوض کرد»، «سفر» for process) | A natural Persian expression |
| Chains of «و» joining 4+ clauses | Break into short sentences |
| Arabic-heavy formal words (مذکور، فوق‌الذکر، کماکان) | Everyday words (همین، این، هنوز) |

Voice: warm, conversational written Persian (نوشتاری محاوره‌ای ملایم) for Telegram/Instagram; cleaner, still personal, for LinkedIn/Blog. Avoid full slang spelling (میخوام) unless the reel voiceover calls for it; use «می‌خواهم» in formal text, «می‌خوام» only in very casual reel voiceover lines.
Mechanics: نیم‌فاصله (ZWNJ) in می‌شود، کتاب‌ها، بزرگ‌ترین، خانه‌ای. Persian punctuation « » ، ؛ ؟. Persian digits in body text — all per `trilingual-localizer`'s glossary and rules, which take precedence on anything specific to Sikke (money terms, Solar Hijri dates).

## Turkish-specific tells (Türkçe)

| Tell | Replace with |
|---|---|
| "Günümüz dünyasında", "Hızla değişen dünyada" | Start with the fact |
| "büyük önem taşımaktadır", "kritik bir rol oynamaktadır" | "önemli, çünkü…" + reason |
| Heavy "-mektedir / -maktadır" chains | Simple present / past: "artıyor", "arttı" |
| "Sonuç olarak", "Özetle", "Unutmamak gerekir ki" | Cut; end on a concrete fact |
| "Sadece … değil, aynı zamanda …" for drama | Direct statement |
| "oldukça", "son derece", "muazzam" stacked | One, or none |
| Literal English ("oyunun kurallarını değiştirdi", "yolculuk") | Natural Turkish expression |
| Long sentences joined with "ve" / "ise" | Split |

Voice: "sen" for Instagram/Reels, "siz" for LinkedIn/Blog and finance topics unless the story calls for otherwise. Use everyday words over Ottoman/Arabic formal ones. Use alongside `trilingual-localizer`'s own Turkish mechanics (number formatting, old-lira notes).

## Final humanizer checklist

Run this on every format, in every language, before handover — part of `post-writer` step 7 and `trilingual-localizer`'s self-check:

- [ ] No "not X but Y", no dramatic one-line closers, no staged run-ups
- [ ] No words from the AI vocabulary list (EN) or the FA/TR tables
- [ ] Sentence lengths clearly vary
- [ ] No em/en dashes (unless the post specifically calls for one)
- [ ] Every sentence adds information
- [ ] No invented facts; all numbers match the card
- [ ] Reads naturally aloud in each language
