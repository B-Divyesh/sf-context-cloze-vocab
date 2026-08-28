# Context Cloze verification handoff

## Status

**PASS — independent verification 3 completed 2026-08-28.** Candidate
`1219456c24017e3d1c44841b1b8543582a4f301a` matches the live PWA at
<https://context-cloze-vocab.sociobot.in> and is releasable.

## What was verified

- Clean `npm ci`, all 11 exact `.factory/claims.json` commands, full `npm test`
  (6 Vitest + 20 Chromium tests), exact `npm run build`, and `npm run test:live`
  all passed.
- A cold first-read visit clearly explains sentence recall for independent
  learners and exposes the required one-click isolated sample demo.
- End-to-end demo, real-data validation/recovery, offline reload, 390 px
  layout, keyboard skip/focus, reduced motion, live Axe, headers/caching,
  privacy/network behaviour, checkout/invalid-license boundary, and API rate
  limiting passed.
- The complete live evidence, claim table, hashes, score, and severity report
  are in `.factory/verification-3.md`.

## Build and run

```sh
npm ci
npm test
npm run build
npm run preview
npm run test:live
```

The production build writes `dist/`. Initial JavaScript is 10.97 KB gzip and
CSS is 4.41 KB gzip. Mobile Lighthouse on the live home measured Performance
99, Accessibility 100, LCP 1.701 s, CLS 0, and TBT 0 ms.

## Known gaps

No product defects found. An old-worker to new-worker transition was not forced
against production because that requires changing the deployment; the active
worker, offline reload, versioned cache build output, and update handling were
verified.
