---
name: farsi-translator
description: Translate text from any language into Farsi (Persian) that reads as if a native Iranian writer wrote it originally, not word-for-word translationese. Use this skill whenever the user asks to translate, localize, or render anything into Farsi/Persian («ترجمه کن»، «به فارسی برگردان»، «فارسی‌اش کن», "translate to Farsi", "in Persian", fa-IR localization) — news, emails, marketing copy, app/UI strings, subtitles, documents, chat messages, legal, technical or literary text — and also when asked to review, fix, polish or "make more natural" an existing Farsi translation, or to write Farsi content from foreign-language source material. Use it even for short snippets: natural register and correct Persian orthography (نیم‌فاصله, ی/ک, « ») are easy to get wrong without it.
---

# Farsi Translator

Translate from any language into Iranian Persian so that the result reads like
original Persian writing. The test for every translation: **could a reader tell
this was translated?** If yes, it is not finished.

Most bad Farsi translations are accurate word by word and still wrong, because
they keep the source language's skeleton (its word order, its passives, its
articles, its idioms) and only swap the vocabulary. Persian readers call this
«ترجمه‌زدگی» or «گرته‌برداری». Avoiding it is the main job of this skill.
Fidelity to meaning is non-negotiable; fidelity to sentence structure is not a
goal at all.

Default target is the Persian of Iran. Use Dari or Tajik conventions only when
the user asks for them.

## Workflow

1. **Size up the text.** Identify source language, genre (news, ad, UI string,
   subtitle, contract, chat…), audience, and register. Mirror the source's
   register unless the user says otherwise. Ask a question only when the
   answer would change the whole translation and cannot be inferred (for
   example, formal vs. colloquial for an ad with no context). Otherwise decide
   and mention the choice in one line after the translation.
2. **Understand before writing.** Read the whole text first. Know what each
   sentence is doing (informing, persuading, joking, warning) and what every
   pronoun and ambiguous phrase refers to. You cannot rephrase naturally what
   you have only parsed.
3. **Write it in Persian.** For each idea ask "how would an Iranian writer say
   this?", then write that. Reorder clauses, split long sentences, merge
   choppy ones, replace idioms with Persian ones. Do not carry structure over.
4. **Native read-through.** Put the source aside and read only the Farsi.
   Anything you would not expect to see in a well-edited Iranian newspaper,
   book, app or chat (whichever matches the genre) gets rewritten. See
   "Sounding native" below.
5. **Fidelity check.** Go back to the source and verify nothing was lost,
   added or bent. See "What must not change".
6. **Orthography pass.** Fix script-level issues. For anything longer than a
   few lines, save the Farsi to a file and run
   `python3 scripts/farsi_lint.py <file>` (add `--fix` for the safe mechanical
   fixes). These errors are invisible to the eye and very visible to readers.

For a short snippet all of this happens in your head in one go. For a long
document, work section by section but keep terminology consistent: once a term
or a name has a Farsi form, use the same form everywhere.

## What must not change

Natural phrasing never justifies changing the content.

- **Numbers.** Every amount, percentage, rate, date, time and quantity stays
  exactly as the source gives it. Never round, convert, "correct" or invent a
  figure. Double-check them last; digit errors are the most damaging and the
  easiest to make when converting to Persian digits.
- **Attribution and certainty.** If the source says "analysts expect" or
  "allegedly", the Farsi must carry the same hedge («تحلیلگران انتظار
  دارند»، «گفته می‌شود»). Do not turn a claim into a fact or a forecast into
  news.
- **Nothing added, nothing dropped.** No explanatory additions, no softened
  or sharpened tone, no skipped clauses. If something truly needs explaining
  for an Iranian reader, put it in a short translator's note, not in the text.
- **Negations and conditions.** "Not unless", "no more than", "at least":
  reread these against the source. Restructuring a sentence is exactly when
  a negation gets flipped.
- **Tone.** A dry report stays dry. A joke should still be funny. An angry
  email stays angry at the same level of politeness.

## Sounding native

The patterns below cause most translationese. `references/translationese.md`
has the full catalogue with many more examples; read it before any translation
longer than a paragraph, or when reviewing someone else's Farsi.

| Habit carried over from the source | Translationese | Native Persian |
|---|---|---|
| Passive with an agent | این قانون توسط مجلس تصویب شد | مجلس این قانون را تصویب کرد |
| Indefinite article "a/an" | او یک پزشک است | او پزشک است |
| Subject pronoun in every clause | من فکر می‌کنم که من باید بروم | فکر می‌کنم باید بروم |
| Padding verbs | مورد بررسی قرار داد | بررسی کرد |
| Plural after a number | سه کتاب‌ها | سه کتاب |
| Literal collocation | این معنی می‌دهد | منطقی است / جور درمی‌آید |
| Literal idiom | یک تکه کیک بود | مثل آب خوردن بود |
| "-ly" adverbs | به‌طور کامل، به‌طور جدی | کاملاً، جدی |
| "will" as explicit future in everyday text | فردا خواهم آمد | فردا می‌آیم |
| "have been …ing for" | برای پنج سال اینجا زندگی کرده‌ام | پنج سال است اینجا زندگی می‌کنم |

Principles behind the table:

- **Persian prefers verbs and active voice.** Find who does what and say it
  that way. «توسط» is almost always a sign the sentence should be flipped.
- **Persian drops what the verb already says.** The verb ending carries the
  subject, so repeated «من»، «او»، «آن‌ها» sound foreign. Keep a pronoun only
  for contrast or clarity.
- **The verb comes last, so keep sentences short enough to hold.** A long
  English or German sentence with stacked relative clauses makes the Persian
  reader wait too long for the verb. Split it into two or three sentences.
- **Use the word people actually use.** Not the dictionary's first entry, not
  an Academy coinage nobody says, and not a showy Arabic or "pure Persian"
  word. «ایمیل» beats «رایانامه» in almost every context; «رایانه» and
  «کامپیوتر» are both alive; pick by register.
- **Idioms and set phrases translate by function.** Find the Persian
  expression used in the same situation ("Bless you" → «عافیت باشه»). If
  none exists, state the meaning plainly. A literal idiom is never right.
- **Cultural references.** Keep them, and let the phrasing make them clear.
  Do not replace them with Iranian equivalents unless the user wants full
  localization (ads and children's content often do).

## Register

Persian has a wide gap between the written language (کتابی / رسمی) and the
spoken one (محاوره‌ای / شکسته), and mixing them inside one text is the fastest
way to sound non-native. Choose one and hold it.

- **Formal written** — news, reports, legal, academic, official letters:
  «می‌خواهم»، «است»، «را»، «آن‌ها»، «نمی‌دانم».
- **Neutral written** — blogs, most marketing, app text, friendly business
  email: written forms, but short sentences and everyday vocabulary.
- **Colloquial (شکسته)** — dialogue, subtitles, chat, casual social posts:
  «می‌خوام»، «ـه» for «است» («خوبه»)، «رو» for «را»، «اونا»، «نمی‌دونم»،
  «می‌تونی»، «بهش»، «یه». Follow Tehran usage, and break words the way
  people actually write them in chat, consistently.

**تو or شما.** Languages with one "you" force a choice. Use «شما» for
strangers, customers, professional contexts and anyone senior; «تو» for
friends, family, children, and brands that deliberately speak intimately.
Keep the verb endings consistent with the choice throughout.

**Politeness.** Persian formal correspondence is warmer and more ceremonious
than English («با سلام و احترام»، «پیشاپیش از همکاری شما سپاسگزارم»). Match
what an Iranian would write in that situation, without inventing content and
without over-flattering.

## Orthography

These are mechanical, and getting them wrong marks a text as machine-made.
`scripts/farsi_lint.py` checks most of them.

- **Persian letters, not Arabic look-alikes:** «ی» (U+06CC) and «ک» (U+06A9),
  never «ي» or «ك».
- **نیم‌فاصله (ZWNJ, U+200C)** instead of a space or nothing in: «می‌روم»،
  «نمی‌خواهم»، «کتاب‌ها»، «خانه‌ای»، «بزرگ‌تر»، «بزرگ‌ترین»، «می‌شود»،
  compound words such as «دانش‌آموز»، «بین‌المللی».
- **Persian punctuation:** «،» «؛» «؟», and « » for quotations. No space
  before punctuation, one space after.
- **Persian digits (۰–۹)** in running Farsi text. Keep Latin digits inside
  things that are Latin: model names, codes, URLs, version numbers. Decimal
  mark «٫» (۳٫۵) and thousands mark «٬» (۱٬۲۵۰٬۰۰۰); if the user's existing
  text uses another convention (the press often writes ۳/۵), follow theirs.
  Write «۵ درصد» in prose.
- **Ezafe after silent ه:** «خانهٔ من» in formal text, «خانه‌ی من» in casual
  text. Use one style per document.
- **Only Persian script, Latin letters, digits and punctuation.** No stray
  characters from the source script (Cyrillic, Chinese, Hebrew…) may survive
  in the Farsi. If you are unsure how to render a word, rephrase with simpler
  Persian instead of leaving a fragment.

## Names, terms, dates, units

- **Places and people take their established Persian form**, which often
  differs from English: Germany → «آلمان», Poland → «لهستان», Munich →
  «مونیخ», Beijing → «پکن». For names without an established form,
  transliterate from the pronunciation in the *original* language, not from
  the English spelling. `references/source-languages.md` has lists and
  per-language rules.
- **Organizations and acronyms:** use the settled Persian name («سازمان
  ملل»، «صندوق بین‌المللی پول»، «ناتو»). Spell the acronym in Latin only when
  Iranians know it that way (GDP, NFT) or there is no Persian form.
- **Original term in parentheses is a last resort.** Add it once, at first
  mention, only for a specialized term the reader may need to look up:
  «وام‌دهی غیرمتمرکز (DeFi)». Never for everyday words («تورم»، «صادرات»)
  and never for names with a settled Persian spelling («بیت‌کوین», not
  «بیت‌کوین (Bitcoin)»). When unsure, leave it out; a missing gloss is not an
  error, a needless one is.
- **Dates:** keep the source calendar, with Persian month names and digits
  («۱۱ اکتبر ۲۰۲۶»). Convert to the Solar Hijri calendar only if asked or when
  localizing fully.
- **Units and currency:** do not convert. If an imperial unit would confuse
  the reader, keep the figure and add the metric value in parentheses, marked
  as approximate.

## Leave these untouched

Code, commands, file paths, URLs, email addresses, placeholders and variables
(`{name}`, `%s`, `{{count}}`, `$1`), HTML/XML tags, Markdown syntax, and JSON
keys. Translate only the human-readable text around them, and keep the
document's structure (headings, lists, tables, line breaks) the same. Place
placeholders where Persian grammar needs them, which is often not where the
source had them.

## Output

- Give **only the translation** by default. No "Here is the translation",
  no romanization, no back-translation, no explanation of obvious choices.
- Add a short note after the translation only when the user needs to know
  something: a real ambiguity in the source and how you resolved it, a
  register or تو/شما choice you had to guess, a probable error in the
  source, or a term with competing Persian renderings.
- When the user gives a file, return the same format with the same structure.
- When reviewing an existing Farsi translation, show the corrected text
  first, then list the important changes briefly with the reason for each.
- For wordplay, slogans, titles and poetry, where one answer is rarely
  enough, offer two or three options with a line on the flavour of each.

## Reference files

- `references/translationese.md` — the full catalogue of calques and how to
  fix them, set phrases, idioms. Read for any substantial translation or
  review.
- `references/genres.md` — conventions per genre: news, marketing, UI
  strings, subtitles, business letters, legal, technical, literary, chat,
  and finance/markets vocabulary. Read the section for your genre.
- `references/source-languages.md` — traps specific to the source language
  (English, Arabic, Turkish, others), false friends, and how to write foreign
  names in Persian. Read the section for your source language.
- `scripts/farsi_lint.py` — orthography checker and fixer.
