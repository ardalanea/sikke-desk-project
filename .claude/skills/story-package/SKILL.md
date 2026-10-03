---
name: story-package
description: Produces the visual and audio package for a finished Sikke edition — cover and carousel visual direction, image prompts in 9:16 and 16:9, reel shot-by-shot prompts, and a music bed brief with Suno and ElevenLabs prompts — in Sikke's paper-collage style. Use after an edition's text is written and verified, when asked for a "story package", "visual package", "video prompts", "music for this edition", or during a Sikke edition cycle (after step 9, before delivery).
---

# Story Package

Turns a verified, written edition into everything needed to make its visuals and soundtrack. The text, hooks, voice and translations are already done by `post-writer`, `sikke-voice` and `trilingual-localizer` — this skill only adds visuals and audio. Do not rewrite the post.

Prompts are written in **English** even when the post is Farsi or Turkish. On-screen text inside the visual is written in the target language and kept to 1–5 words. For Farsi and Turkish on-screen text, the brief tells the editor to add the text in the edit rather than asking the image or video model to render it, because generated non-Latin text often breaks.

## Inputs

- The edition's English content (all five formats) and its `reel` beat table.
- The verified fact cards it uses (for any historical detail a visual shows).
- `references/style-sikke-collage.md` for the fixed look.

## Steps

1. **Read the edition and pick the visual metaphor.** One sentence: what single image makes someone stop scrolling and understand the hook. One hero element.
2. **Cover visual.** Write the cover in 9:16 and 16:9 using `references/prompts-image-video.md`. Give three model variants (universal, Nano Banana/Gemini, Higgsfield) and a negative line. Recompose for 16:9 rather than only changing the ratio.
3. **Carousel visual brief.** One line per slide from the carousel table: what the slide shows, its style note, and the on-screen text (1–5 words). Reuse the carousel's own visual column where it fits the style; replace it where it doesn't.
4. **Reel shots.** Map each beat of the reel table to one shot (keyframe prompt + image-to-video motion prompt). Keep 5–7 shots, 4–6 s each. Shot 1 is the reference for all others; say so. Do not write new voiceover — the reel table already has the spoken lines.
5. **Music.** Fill the music brief from the reel's timings, then write the Suno and ElevenLabs prompts using `references/music.md`. Instrumental bed under the voiceover, sized to the reel length plus 1–2 s, with a lift at the payoff timestamp.
6. **Sources and rights.** For any historical image named in a visual, say where it comes from and its licence (CC0 or public domain preferred; no British Museum images on brand channels; otherwise mark the visual "illustration"). Never put a real person's face, a real brand logo or a copyrighted character in a prompt.
7. **QC.** Run the checklist at the end of `references/output-template.md`.

## Hard rules

- No new facts. Every number, name or date in an on-screen text or visual label must already be in the edition's text.
- Accuracy beats drama. An allegation stays labelled as an allegation in the visual too ("SEC says", "allegedly"); a court outcome is never shown as settled.
- Historical and regional figures: depict objects and places, not invented portraits of named individuals.
- No gibberish text in prompts. If text appears in the image, it is the on-screen text listed in the brief and nothing else.
- Keep the package under about 2,500 words. Copy-ready code blocks for every prompt.

## Output

Write the package as Markdown following `references/output-template.md`, to the file path the caller specifies. Return nothing else.
