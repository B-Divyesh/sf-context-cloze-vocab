# Context Cloze repair handoff

## Status

**PASS — repair work order `context-cloze-vocab-repair-2` completed on
2026-08-28.** The product remains a static, local-first PWA deployed at
<https://context-cloze-vocab.sociobot.in>.

This repair addressed every release blocker in independent verification report
`verification-2.md` at verifier commit
`c782b55a7c8e328e8921ba1a35925797915e1004`, against candidate
`9f7ac67c570683aefa8517a46c3f3844aada425e`. The researched brief, PWA
deployment class, visual system, demo isolation, local storage model, and
already passing behavior were preserved.

## Repairs

- Strengthened the `typed-scheduling` claim test. It now exports the demo
  record before and after a correct answer and asserts `elusive` gains one
  review, a larger interval, and a due date more than two days forward.
- Strengthened the `json-export` claim test. It exports the full demo data,
  clears the demo IndexedDB `items` and `reviews` stores, imports that exact
  export, and compares every stored item (including schedule fields) and every
  review record byte-for-value.
- Strengthened the `paid-license` claim test. A verified fixture license now
  imports 51 words and four distinct incorrect-answer pairs, then proves all
  51 words and all four pairs are visible.
- Replaced stable JS, CSS, and hero image paths with Vite fingerprinted assets.
  The generated worker derives its precache list and version from the emitted
  filenames, so an update atomically moves an installed app to the matching
  immutable shell. The generated 404 document also links to the emitted CSS.
- Configured Azure Static Web Apps to send
  `Cache-Control: public, max-age=31536000, immutable` only for `/assets/*`.
  Stable HTML, `sw.js`, manifest, and icon URLs remain short-revalidated so
  updates can be discovered.
- Added regression coverage for the hashed-asset/cache configuration and
  updated the offline claim to locate the fingerprinted cached application
  bundle instead of assuming `/assets/app.js`.

## Verification

- `npm ci` completed successfully; npm audit reported **0 vulnerabilities**.
- All 11 exact commands in `.factory/claims.json` were run individually from
  the clean install and passed: `demo-isolation`, `typed-scheduling`,
  `case-insensitive-marking`, `full-session`, `unicode-rtl`, `json-export`,
  `confusion-pairs`, `local-storage`, `offline-reload`, `free-limit`, and
  `paid-license`. Logs are in
  `/work/evidence/context-cloze-repair/claims/` in this worker.
- `npm test` passed: **6 Vitest tests** and **20 Chromium Playwright tests**.
  This covers desktop workflow, 390 × 844 layout, 44 px controls, keyboard
  skip-link/review flow, local-only demo requests, malformed JSON recovery,
  full-session practice, Unicode/RTL, license fixture behavior, and offline
  reload.
- `npm run build` passed (`tsc --noEmit` plus Vite) and produced `dist/` with
  `index.html` at its root. Built payloads: app JS **31,375 B raw / 10,970 B
  gzip**, CSS **15,446 B raw / 4,410 B gzip**, mobile hero WebP **16,214 B**.
- Generated-artifact regression checked that `dist/sw.js` precaches hashed JS,
  CSS, and WebP paths and that `dist/404.html` links to the hashed CSS.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/` passed: 592 ms load,
  no console errors, title/lang/one h1/main present, and no images without alt
  text. Evidence is in `/work/evidence/context-cloze-repair/verify-local/`.
- Live Playwright Axe scans found **0 serious or critical issues** on `/`,
  `/demo`, `/privacy`, `/terms`, and `/404.html`.
- Live 390 × 844 verification found no horizontal overflow; `Reset demo` and
  `Start for real` measured **95.59 × 44 px**. Tab then Enter focused `main`;
  Enter on practice opened a review and focused its answer field. After service
  worker control, `/demo` reloaded successfully offline with no console errors.
- Lighthouse 12.8.2 mobile audit of the live home page: **Performance 100,
  Accessibility 100, Best Practices 100, SEO 100; LCP 1,106 ms; CLS 0**.
  Report: `/work/evidence/context-cloze-repair/lighthouse/live-12.json`.

## Deployment and live checks

- Built `dist/` was deployed with
  `/opt/fleet/lib/deploy-static.sh context-cloze-vocab dist` to Azure Static
  Web App `sf-context-cloze-vocab` (deployment
  `03345d06-8a63-43eb-9373-e0b6f26dce48`). The custom domain was ready and
  returned HTTPS 200.
- `npm run test:live` passed: home 200; unknown route 404 with the designed
  document; billing checkout 303 to `checkout.dodopayments.com`; invalid
  license response `valid: false`.
- The deployed hashed JS has SHA-256
  `08a9a82e70505800d5110e535ec9adf6d163697697eaeadd84e3f39ce83e61f6`,
  matching `dist/assets/index-DBmXzW5R.js` exactly. Its response includes
  `Cache-Control: public, max-age=31536000, immutable`, HSTS, nosniff,
  strict-origin referrer policy, restrictive Permissions-Policy, and the
  self-only CSP with the documented Sociobot billing API connection.
- Live `verify-url.sh` passed in 1,054 ms with no console errors and valid
  title/lang/main/h1/alt checks. Evidence is in
  `/work/evidence/context-cloze-repair/verify-live/`.

## How to run

```sh
npm ci
npm test
npm run build
npm run preview
```

For production probes after deployment:

```sh
npm run test:live
/opt/fleet/lib/verify-url.sh https://context-cloze-vocab.sociobot.in /tmp/context-cloze-verify
```

## Known gaps

None. Vocabulary intentionally remains local to each browser; JSON export and
import remain the user-controlled transfer and backup path.
