# Context Cloze repair handoff

## Status

Release repair for verifier report `e7ed8e28a926856ec3b321a7214c9f7a9e5570d0`.
Released to `https://context-cloze-vocab.sociobot.in` from repair commits
`12c131e` and `cc4930c`.

## Repairs

- Registered and enabled the live Sociobot billing product for Context Cloze:
  a $12 USD one-time personal license with the return URL
  `https://context-cloze-vocab.sociobot.in/`. The product is listed by the
  public billing catalogue and its checkout endpoint returns HTTP 303 to a
  hosted Dodo checkout session.
- Raised the 390 px demo banner actions and compact wordmark to at least
  44 × 44 px, with a dedicated Playwright geometry regression.
- Added `responseOverrides.404` and a standalone styled `404.html`, preserving
  SPA navigation while allowing the Static Web App to send a real 404 response
  for unknown URLs. The deployment probe checks both status and page content.
- Declared the capitalisation and full-session promises in
  `.factory/claims.json` with independently runnable demo tests. The offline
  claim now also identifies the offline page.
- Replaced raw malformed-JSON parser text with: “This file is not valid JSON.
  Choose a Context Cloze JSON export.”
- Improved keyboard behavior beyond the verifier finding: the skip link now
  transfers focus into the main landmark. A keyboard regression verifies that
  a demo review can start with the keyboard.
- Added `npm run test:live`, a release probe that verifies the deployed home
  response, real HTTP 404, hosted checkout redirect, and rejection of an
  invalid license token.

## Verification before deployment

- `npm ci`: passed; npm audit reported 0 vulnerabilities.
- Every command in `.factory/claims.json` was run individually from the clean
  install and passed (11 claims).
- `npm test`: passed — 5 Vitest tests and 20 Chromium Playwright tests.
  Axe Playwright scans reported no serious or critical violations for `/`,
  `/demo`, `/privacy`, `/terms`, and `/404.html`.
- Browser checks covered desktop, 390 × 844 mobile layout, 44 px demo controls,
  keyboard skip-link/review flow, and the service-worker offline-reload claim.
- `npm run build`: passed. `dist/` contains `index.html` at its root. Payload:
  app JS 31.34 KB raw / 10.93 KB gzip; CSS 15.44 KB raw / 4.39 KB gzip.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/` passed after the
  production build: 573 ms load, no browser-console errors, one h1, main,
  `lang="en"`, and no images missing alt text.
- Lighthouse 12.8.2 (local production preview): Performance 99,
  Accessibility 100, Best Practices 100, SEO 100; FCP 955 ms, LCP 1268 ms,
  CLS 0, TBT 125 ms.

## Deploy and live verification

- Deployed `dist/` to the existing Azure Static Web App
  `sf-context-cloze-vocab` on 2026-08-28. The deployment completed
  successfully and the custom domain is ready.
- `npm run test:live`: passed against the public domain. Home returned 200;
  an unknown route returned 404; the checkout endpoint returned 303 to
  `checkout.dodopayments.com`; and an invalid license token returned
  `valid: false`.
- `verify-url.sh` on the public home passed: 943 ms load, no console errors,
  title/lang/main/one h1 present, and no missing image alt text.
- Live browser desktop and 390 × 844 checks passed: skip link focused main,
  demo controls measured 95.59 × 44 px, no horizontal overflow, and no page
  errors.
- Live PWA check passed: after the service worker took control, `/demo`
  reloaded offline with the sample heading and eight words visible.
- Live response policy confirms HSTS, nosniff, strict-origin referrer policy,
  restrictive Permissions-Policy, and the self-only CSP with the documented
  Sociobot billing API connection.

Run the deployed checks again with:

```sh
npm run build
/opt/fleet/lib/deploy-static.sh context-cloze-vocab dist
npm run test:live
```

## Known limitations

- Vocabulary is intentionally local to each browser. JSON export/import is the
  transfer and backup path.
- A live hosted checkout redirect and invalid-token verification are exercised
  without creating a charge; a completed purchase is handled by Sociobot/Dodo.
