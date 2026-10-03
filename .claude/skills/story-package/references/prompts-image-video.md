# Image and Video Prompting for Sikke

Adapted from the Story Studio image and video references. Prompts are English, copy-ready, and always start with the Style Anchor from `style-sikke-collage.md`.

## 1. Concept first

One sentence: the single image that makes someone stop scrolling and understand the hook. One hero element, high contrast with the paper, room for the headline.

Visual metaphor examples for money stories:
- A counterfeit certificate with its seal lifting off the page.
- A stack of notes built from paper, the bottom sheets already torn.
- A coin on a ledger with one column of figures crossed out.

## 2. Universal image structure

Write natural sentences, in this order:

1. Style Anchor (from the style bible).
2. Subject, with 5–10 concrete attributes.
3. Action or pose.
4. Setting, built from paper.
5. Composition and camera, with where the empty space for text sits.
6. Light and palette (named colours, from the Sikke palette).
7. Text, in quotes, if any (max 5 words, target language).
8. Ratio and quality: "9:16 vertical" or "16:9 horizontal", "high detail, clean edges".
9. Avoid line.

## 3. Ratio compositions (recompose, don't just change the ratio)

**9:16 vertical (Reel, Story, Telegram vertical):** headline space in the top third, hero object centre, calm paper at the bottom. Keep key elements clear of the top 14% and bottom 20%, and the right edge.

**16:9 horizontal (LinkedIn, blog header, link preview):** hero object on the left or right third, empty paper on the other side for the headline. Keep the subject inside the centre 60% in case of cropping.

## 4. Model variants

Each cover gets three versions:

- **Universal:** the structure above in one paragraph.
- **Nano Banana / Gemini:** start with "Create a [ratio] editorial illustration of…", describe layout in words, put any text in quotes with its placement. For consistency across shots, say "keep the same style as the reference image".
- **Higgsfield / Midjourney-style (compact):** `[style], [subject], [action], [setting], [composition], [light], [palette], [details] --ar 9:16` (or `16:9`), with `--no text, watermark, logo` for the negative.

## 5. Cover prompt template

```
[RATIO] paper-collage editorial illustration. [STYLE ANCHOR]. [HERO OBJECT with 5–10 attributes] [ACTION] on [PAPER SETTING].
Composition: [hero position], [empty space for headline on the side or top].
Light: one warm soft light from top-left, real paper shadows. Palette: [2–4 named colours from the Sikke palette].
Text: "[EXACT TEXT, 1–5 words, target language]" in [bold Bodoni-style cut-out letters], [placement]. (omit if none)
Avoid: [NEGATIVE LINE].
```

## 6. Carousel visual brief (per slide)

One line per slide, no prompt needed unless the slide needs an image:

```
Slide [n] | Visual: [what is shown, one hero element] | Style: [cut-paper element / engraved line / stamp / halftone] | On-screen text: "[1–5 words]" | Source image: [licence note, if real archival]
```

## 7. Reel shots: keyframe and motion prompts

Map the reel table's beats to 5–7 shots. For each shot:

**A) Keyframe image prompt (start frame), 9:16**
```
9:16 vertical paper-collage keyframe. [STYLE ANCHOR]. [SCENE: hero object and supporting paper pieces for this beat]. Composition: [framing], [empty space for on-screen text]. Light: warm soft light from top-left. Palette: [named colours]. Avoid: [NEGATIVE LINE].
```

**B) Image-to-video motion prompt (Kling/Higgsfield format, 4–6 s)**
```
The paper [subject] [action 1], then [action 2], finally [action 3]. Supporting pieces [motion]. Background layers shift slightly for paper parallax. Camera: [static / slow push-in / lateral slide]. Stop-motion at 12 fps with slight jitter, handmade paper-collage animation. [4–6] seconds. No text, no subtitles.
Negative: photorealism, smooth CGI motion, morphing, warped faces, extra limbs, text, watermark.
```

**Veo 3.x variant:** add `Audio: paper rustle, scissor snip, soft ledger page turn; no dialogue, no on-screen text.` Default is no dialogue in generated video; the voiceover is recorded separately from the reel table.

Shot 1's keyframe is the reference image for all later keyframes. Use one change per shot (a new object, a new position), not five.

## 8. Timing

Reel default: 30–35 s, 5–7 shots, 4–6 s each. Hold the hook frame no more than 2.5 s. Leave 0.5 s between shots for the cut. Voiceover runs about 2.2 words per second in Farsi and 2 words per second in Turkish, so check the reel table's timings against the spoken lines.

## 9. Edit notes (for the editor, not the model)

- Cut on the voiceover beats.
- Add paper SFX on every slide, pop or stamp.
- Put Farsi and Turkish on-screen text in the edit on a paper strip, 1–4 words, inside the safe zone.
- End card: 2 s, Sikke logo and "Sikke · money's strangest true stories" in the target language.
