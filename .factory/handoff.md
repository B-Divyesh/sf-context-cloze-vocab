# Context Cloze — independent verification 4 handoff

## Status

**PASS — verified for release.** Candidate
`eb80714f042a6e9e95c8c472f8af40650d6b3420` is deployed at
<https://context-cloze-vocab.sociobot.in> and matches its production artifacts
byte-for-byte.

## What was verified

- `npm ci`, every one of the 23 exact commands in `.factory/claims.json`, and
  `npm test && npm run build` passed from this checkout. The full suite ran 12
  Vitest and 40 Chromium tests; `dist/` was produced.
- Cold first-read, one-click eight-word demo, real/demo storage isolation,
  word-list paste, typed recall and scheduling, Unicode/RTL, backup/restore,
  free and license boundaries, malformed import recovery, privacy, and offline
  reload passed on the live PWA.
- Production routes, 404 behavior, checkout redirect, invalid-license check,
  headers/caching, response identity, link crawl, 390 px layout, keyboard
  focus, reduced motion, Axe, request logging, service-worker control/update
  check, rate limiting, and Lighthouse were freshly verified.

## Measured evidence

- Live app JS SHA-256:
  `f2f1f3b90bce178f0edfec3aa60f79d62c035082383ea727d28031042545e639`.
- Live checkout: HTTP 303 to a hosted Dodo checkout. License verification:
  30 requests permitted, request 31 HTTP 429, `Retry-After: 4`.
- Bundle: JS 37,104 B raw / 12,026 B gzip; CSS 16,320 B raw / 4,582 B gzip;
  mobile hero 16,214 B.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 20 ms, CLS 0.

Read `.factory/verification-4.md` for the complete independent evidence and
finding severity list. Screenshots/live browser output are in
`.factory/evidence/verification-4/`; the Lighthouse report is
`.factory/evidence/verification-4-lighthouse.json`.

## How to run

```sh
npm ci
npm test
npm run build
npm run test:live
LIVE_EVIDENCE_DIR=.factory/evidence/verification-4 npm run test:live:browser
```

## Known gaps / next steps

None. No product code was changed during verification.
