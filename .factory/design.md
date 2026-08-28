# Context Cloze visual thesis

## Direction: the night archive

Context Cloze uses cinematic environmental art, seen through the world of a
late-night language learner. A dark, rain-softened reading room opens toward a
distant horizon. Paper slips and small lamps make words feel placed, retrieved,
and remembered. The scene establishes the mood; the task surfaces stay calm and
legible. This fits a private daily practice better than badges, streaks, or a
bright classroom feed.

The site is deliberately single-mode. The painted night is the product's world,
not a system-theme imitation. Warm task surfaces maintain strong contrast.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| night | `#0b1820` | page background and deep horizon |
| deep | `#112832` | raised navigation and panels |
| paper | `#f3ead7` | primary text and study sheets |
| paper-2 | `#ddd0b8` | muted text on dark |
| ink | `#17282c` | text on paper |
| amber | `#e7aa4b` | primary action and focus |
| amber-dark | `#6f4311` | text and borders on light |
| moss | `#7fa58a` | success and scheduled states |
| ember | `#d9785f` | errors and destructive actions |
| mist | `#94acb2` | secondary controls |

All body text/background pairs target WCAG AA. Color is always paired with
text, shape, or an icon.

## Typography

- Display: Georgia, Cambria, `Times New Roman`, serif. Its bookish shapes make
  sentence fragments feel authored rather than generated.
- Body and controls: system sans (`Inter`-like platform stack). It keeps data
  entry and review fast. No font file or third-party request is needed.
- Type steps: 14, 16, 18, 24, 34, and fluid 48–72 px. Text measures stay below
  70 characters.

## Spacing and shape

An 8 px base rhythm drives 8, 16, 24, 32, 48, 72, and 96 px gaps. Working
surfaces resemble clipped study paper: 3 px corner cuts and thin amber rules.
The hero uses an asymmetric 5/7 split, like a film still beside field notes.
Buttons are compact tabs with one clipped corner. Cards appear only for
independent words or review records.

## Interaction grammar

- Primary actions glow amber and shift up 2 px on hover.
- Practice moves from sentence to answer to feedback in the same physical
  sheet. Focus never jumps away from the learner's typing position.
- Correct answers add a brief lamp-like wash. Incorrect answers add a still
  ember rule and reveal the exact answer.
- Route changes focus the page heading and announce its title.

## Motion policy

The signature motion is a single slow depth reveal: the hero scene settles by
12 px while its paper notes arrive from the foreground over 450 ms. Task changes
use 180–240 ms opacity and transform transitions. Nothing loops. With
`prefers-reduced-motion: reduce`, all transforms and smooth scrolling become
instant; state remains clear through contrast and labels.

## Asset plan and provenance

One original wide environmental scene supports the hero and demo backdrop. A
cropped derivative becomes the 1200×630 social image. Icons and the wordmark are
hand-authored SVG so their line language stays exact. PWA icons are composed
locally from the same lantern-and-blank motif.

### Prompt sheet

- Use case: stylized-concept
- Asset: wide landing hero, with room for interface copy outside the image
- Subject: an empty late-night study alcove, open notebook with blank paper
  slips, small amber reading lamp, rain on a window, distant blue-green hills
- World and materials: aged wood, linen paper, oxidized brass, damp glass
- Light and lens: cinematic 35 mm wide shot, low eye level, deep blue ambient
  light, warm practical lamp, soft film grain, layered atmospheric depth
- Palette words: ink navy, storm teal, parchment, moss, restrained amber
- Composition: notebook and lamp in lower right, clear dark breathing room at
  upper left, no people
- Negative list: no text, no letters, no logos, no watermark, no brands, no
  fantasy symbols, no neon gradient, no UI mockup, no distorted objects

Generated with the factory image model (`factory-image`) on 2026-08-28. The
asset is original to this product. The source PNG and prompt sidecar live in
`assets/src/`; web derivatives live in `public/assets/`.
