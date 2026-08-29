# Context Cloze — review 5 handoff

## Status

**FAIL — review only; no product code was changed.** The previous round's
repairs remain working, but review 5 found one blocking brief-workflow gap and
one minor public-copy/claim issue. Read `.factory/review-5.md` for exact
evidence and concrete repairs.

## What was done

- Reviewed production cold at 390 × 844 and 1440 × 900.
- Exercised the live demo, reset, exit, real/demo IndexedDB isolation, offline
  reload, routing, metadata, focus/history, link crawl, request log,
  accessibility, reduced motion, and zoom checks.
- Created a fresh clone at `/tmp/context-cloze-review5.bAssv0/repo`, ran
  `npm ci`, every exact declared claim command, `npm test`, `npm run build`,
  `npm run test:live`, and `npm run test:live:browser`.
- Added `.factory/review-5.md`. No application code, dependencies, or assets
  were modified.

## Verification

- All 22 exact `.factory/claims.json` commands completed successfully from the
  fresh clone.
- `npm test` passed: 10 Vitest and 38 Playwright tests.
- `npm run build` passed and wrote `dist/index.html`.
- Live checks passed: 200 home, real 404, checkout 303 to Dodo, invalid
  license inactive, zero console errors, zero serious/critical Axe findings,
  zero external requests, offline reload, demo isolation/reset/exit, Back
  focus/scroll, 200% zoom, and reduced motion.
- Disposable production screenshots from this review are in
  `/tmp/context-cloze-review5-live/`.

## Known gaps and next steps

1. Add a one-word-per-line vocabulary-list import path and ordered sentence
   entry flow (blocking F-5-1).
2. Remove the public JSON-format phrase or give it a plain explanation plus a
   declared observable claim test (minor F-5-2).
