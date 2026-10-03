# Music for Sikke Editions

Adapted from the Story Studio music prompting guide. Default is an instrumental bed under the voiceover. Lyrics are only written when the owner asks for a song.

Music prompts are written in English. Describe the sound, never a real artist, band or song.

## 1. Music brief (fill first, one line each)

| Item | Sikke default |
|---|---|
| Purpose | Bed under voiceover, instrumental |
| Length | Reel length + 1–2 s |
| Mood arc | Set per story (see presets) |
| Genre | Pick one lane from presets |
| Tempo | 90–110 BPM for explainers, 78 for historical or personal, 96 for odd-money light stories |
| Instruments | 3–5, named concretely |
| Vocals | None |
| Production | Warm, sparse mid-range, leaves room for voiceover |
| Moments | A lift at the payoff timestamp (from the reel's beat table), a clean ending |

## 2. Presets by story type

**Money history and curiosities (default):** whimsical acoustic, light orchestral, curious and warm, 96 BPM, pizzicato strings, marimba, soft upright piano, light woodblock and shaker, sparse mid-range.

**Historical and regional stories:** gentle storybook score, reflective, measured, 78 BPM, felt piano, cello, low music box, restrained. No drums, no Middle Eastern or Turkish folk instruments used as a national signifier; keep it universal and quiet.

**Fraud and cons (detective tone):** dry, tense but not alarming, 100 BPM, muted pizzicato, low upright bass, light brushed snare, a single high marimba hit at the reveal. No horror stings.

**Crypto and risk:** clean, precise, minimal electronic pulse, 110 BPM, soft pads, one plucked motif, a clean cut at the payoff. No hype build.

## 3. Suno (instrumental bed)

```
STYLE: [genre], [mood 1], [mood 2], [BPM] BPM, [instrument 1], [instrument 2], [instrument 3], instrumental, sparse mid-range leaving space for voiceover, [production], soft intro, gentle lift at [timestamp], clean ending
EXCLUDE: vocals, heavy drums, distorted guitar, sudden loud hits
INSTRUMENTAL: on
LYRICS (structure only):
[Intro: soft, minimal]
[Instrumental: steady, calm groove]
[Build: gentle lift]
[Outro: clean ending]
[End]
```

## 4. ElevenLabs Music (natural-language paragraph)

```
A [length]-second [genre] track, [mood], around [BPM] BPM. [Instruments]. Instrumental, no vocals. Structure: 0:00–0:08 soft intro with [element]; 0:08–[payoff start] steady groove that leaves space for voiceover; [payoff start]–[payoff end] gentle lift with [element] for the payoff; [payoff end]–[length] clean ending. Mix: warm, sparse mid-range, quiet enough to sit under a voiceover.
```

## 5. Udio (tags)

```
[genre], [sub-genre], [mood], [BPM] BPM, [instruments], instrumental, [production]
```

Generate the payoff section first, then extend the intro and outro.

## 6. Matching the reel

- Length = reel length + 1–2 s. Generate a little longer, trim in the edit.
- Music at −18 to −22 dB under the voiceover; duck it further where the voiceover is dense.
- No music intro longer than one second, so the hook lands.
- Name the payoff timestamp from the reel's beat table in the prompt.

## 7. Songs and jingles (only when asked)

A jingle or sting is 3–6 s: one motif, one instrument, a clear end. A full song needs the owner's request and its language; lyrics follow the Suno lyric rules (4–8 lines per section, a short repeated chorus), and Farsi and Turkish lyrics are written natively under `trilingual-localizer`'s rules.
