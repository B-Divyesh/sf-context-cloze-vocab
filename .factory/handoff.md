# Context Cloze polish round 3 handoff

## Status

**PASS — every finding from review rounds 1–3 is closed.** The repaired PWA is
live at <https://context-cloze-vocab.sociobot.in>. The deployed product code is
commit `3907ecbec4cf16a9321d7f3da90f1c98044c4506`.

## What changed

- Rewrote every residual mood label, metaphor, provenance statement, and
  unproved merchant/refund statement identified in review 3. The first screen
  remains job-first and keeps its primary sample action visible on a 390 × 844
  phone.
- Strengthened `demo-isolation` to prove the demo never displays, reads, or
  changes a named real word. It also proves demo-only data never reaches the
  real database, reset restores the active sample question, and exit clears
  demo records.
- Cleared items, reviews, and notices before the first render when switching
  between real and demo stores. This closes the transient real-word toast and
  list exposure caught during the first post-deploy cold check.
- Precached the exact `/?demo=1` URL. The catalog path now reloads offline
  after its first visit, while `/demo` remains the canonical equivalent.
- Kept route-specific titles, descriptions, canonicals, Open Graph/Twitter
  metadata, h1 focus, Back scroll restoration, designed HTTP 404, legal links,
  security headers, and immutable hashed assets under regression coverage.
- Added `tests/copy.test.ts` and `scripts/verify-live-browser.mjs`. The latter
  repeats the production mobile, demo, privacy, route, Axe, focus, 200% text,
  reduced-motion, site-data deletion, request, console, and offline checks.
- Updated `.factory/claims.json`, `.factory/demo.md`, `.factory/copy-audit.md`,
  `.factory/polish-3.md`, README, and the catalog line. The catalog description
  is: “Practise your own words by typing each missing word in context.”

The original night-archive palette, generated environmental scene, clipped
paper surfaces, asymmetric layout, typography, restrained motion, local-first
IndexedDB model, and `pwa-offline` deployment class remain intact.

## Clean-clone verification

Final clean clone: `/tmp/context-cloze-polish3-final.5PRxEl/repo` at
`3907ecbec4cf16a9321d7f3da90f1c98044c4506`.

- `npm ci`: passed; 61 packages installed and 0 vulnerabilities.
- Every one of the 19 exact commands in `.factory/claims.json` passed
  individually: `demo-sample-count`, `demo-isolation`, `typed-cloze`,
  `typed-scheduling`, `due-queue`, `case-insensitive-marking`, `full-session`,
  `unicode-rtl`, `unicode-normalisation`, `backup-roundtrip`,
  `confusion-pairs`, `no-tracking-resources`, `local-storage`,
  `checkout-link`, `license-token-privacy`, `clear-site-data`,
  `offline-reload`, `free-limit`, and `paid-license`.
- `npm test`: passed — 9 Vitest unit/config/copy tests and 35 Chromium tests.
  The browser suite includes every claim, all-route Axe, direct demo entry,
  transient demo DOM isolation, offline reload, keyboard focus, Back history,
  route metadata, 390 px first views, legal links, privacy requests, and 44 px
  demo controls.
- `npm run build`: passed and produced `dist/index.html`. JavaScript is 33.17
  KB raw / 11.24 KB gzip; CSS is 15.85 KB raw / 4.48 KB gzip; mobile hero is
  16.21 KB and desktop hero is 37.10 KB.
- Local Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 908 ms, LCP 1,512 ms, CLS 0, TBT 49 ms.

## Deployment and final live verification

The work-order build command `npm ci && npm test && npm run build` passed. The
artifact was deployed with the configured static deployment script. The first
cold-live screenshot exposed a transient saved-word notice; that issue was
fixed in `3907ecb`, rebuilt, pushed, and redeployed before final verification.

- `npm run test:live`: home 200, designed unknown route 404, checkout 303 to
  `checkout.dodopayments.com`, and invalid license rejected.
- `npm run test:live:browser`: `/`, `/demo`, `/privacy`, `/terms`, and
  `/offline` returned 200; an unknown route returned 404. All had one h1, one
  main, correct title/social metadata, and zero serious/critical Axe findings.
- Cold 390 px home kept **Try it with sample data** at y=513. One click opened
  `/?demo=1`; its blank, answer field, and **Check answer** ended at y=564.
  Demo banner actions and the compact home link remained at least 44 × 44 px.
- The live isolation run kept real `keepsake`, never exposed it during any demo
  DOM mutation, removed demo `temporary` on reset, and left the demo database
  empty after exit. The final demo screenshot has no real-word toast.
- Live browser site-data deletion removed named real/demo records and the
  stored license before reload, then showed an empty real list and fresh
  eight-word demo. The exact `/?demo=1` URL also reloaded offline.
- Normal home/demo/privacy/terms use made no cross-origin requests and emitted
  no console errors. Restore backup had a solid 3 px dark-amber focus ring.
  Route focus and Back scroll passed; 200% text had 0 px horizontal overflow;
  reduced motion used a 0.00001 s animation duration.
- `/opt/fleet/lib/verify-url.sh` passed for `/` and `/?demo=1`: correct title,
  `lang=en`, one h1, main, alt text, and zero page/console errors.
- Live Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 910 ms, LCP 1,060 ms, CLS 0, TBT 46 ms.
- Deployed JavaScript SHA-256 matches local `dist`:
  `db87327f770515e395c8548eca33afed1ded87225bf53d278a14febbef044697`.
  CSS also matches:
  `75b2e2f0082bd39698d940e251f0e643c78f17f81618d945077353e9c23bcfb7`.
  Hashed assets return `Cache-Control: public, max-age=31536000, immutable`.

Evidence screenshots are under `.factory/evidence/` with `polish-3-` and
`polish-3-live-` prefixes. The complete finding-to-evidence map is in
`.factory/polish-3.md`.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:live
npm run test:live:browser
```

For an individual visitor-facing claim, run its exact command from
`.factory/claims.json`. Set `LIVE_URL` to check another deployment and
`LIVE_EVIDENCE_DIR` to save live browser screenshots.

## Known gaps and next steps

None. No review finding, deferred minor item, stub, or TODO remains.
