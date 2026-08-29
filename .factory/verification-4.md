# Independent verification 4 — Context Cloze

**Result: PASS — release approved.**

Verified on 2026-08-29 from candidate commit
`eb80714f042a6e9e95c8c472f8af40650d6b3420` against
<https://context-cloze-vocab.sociobot.in>.

## First read

A cold, new-browser load returned 200 with the title **“Context Cloze —
practise words in sentences”**. The first screen says **“Recall words inside
sentences”**, says it is for independent learners who can recognise words but
cannot retrieve them while writing or speaking, and exposes **“Try it with
sample data”** in the first viewport. The adjacent text says it opens eight
sample words and leaves the learner's word list untouched. This passes the
plain-words and one-click isolated-demo gates.

## Mandatory claims gate

`.factory/claims.json` exists and declares 23 claims. After `npm ci` (61
packages; 0 vulnerabilities), I ran every listed `test` command individually
from this checkout, in manifest order, through the shipped Playwright demo
entry point. All passed:

- `demo-sample-count`, `demo-isolation`, `typed-cloze`, `typed-scheduling`,
  `due-queue`, `case-insensitive-marking`, `full-session`
- `unicode-rtl`, `unicode-normalisation`, `backup-roundtrip`,
  `confusion-pairs`, `no-tracking-resources`, `local-storage`
- `checkout-link`, `tab-bulk-entry`, `word-list-paste`, `due-session-only`,
  `free-confusion-limit`, `license-token-privacy`, `clear-site-data`,
  `offline-reload`, `free-limit`, `paid-license`

The complete local gate then passed: `npm test && npm run build`. It ran 12
Vitest tests and 40 Chromium tests, type-checked with `tsc --noEmit`, and
produced `dist/`.

## Product and recovery coverage

The claim and live flows cover saving a real word/sentence, typed correct and
incorrect recall, due-only and full sessions, scheduling, case-folding,
composed/decomposed accents, Arabic RTL text, confusion-pair limits, 50/51-word
free-tier boundaries, backup/import round-trip, malformed-import recovery,
tab-separated bulk entry, and ordered bare-word sentence entry.

On the deployed 390 px demo, I additionally created real `keepsake` data,
entered the isolated demo, pasted three sample words, advanced its focused
sentence queue, reset it, and exited. Real storage remained `['keepsake']` and
demo storage was empty after exit. Browser site-data clearing removed both
databases and the stored license; the next demo reseeded eight words.

## Live deployment, privacy, PWA, and security

- Deployment identity: local and live `index.html`, `sw.js`, manifest, JS,
  CSS, and hero asset matched byte-for-byte. The app JS SHA-256 is
  `f2f1f3b90bce178f0edfec3aa60f79d62c035082383ea727d28031042545e639`.
- `npm run test:live` passed: home 200, unknown route 404, checkout 303 to a
  hosted `checkout.dodopayments.com/session/...` URL, and an invalid token did
  not activate a license. This is fresh evidence that the earlier
  deployment-only checkout failure is resolved.
- Fresh Playwright request logs for home, demo, privacy, terms, and offline
  contained only same-origin requests. A returned test license was stored
  under `sb_license:context-cloze-vocab`, stripped from the address bar, and
  made exactly one cross-origin request, to the documented Sociobot verification
  endpoint. There were no console errors or page errors.
- Responses include HSTS, `nosniff`, strict-origin referrer policy, restrictive
  permissions policy, and a CSP limited to self plus `api.sociobot.in` for
  checkout/license communication. Hashed assets are cached
  `public, max-age=31536000, immutable`; documents use 30-second
  must-revalidate caching.
- The PWA has an active controller at `/sw.js`; `registration.update()`
  completed against the live worker, and a first-visit demo reloaded offline
  with its eight samples and no errors. The generated worker uses versioned
  caches, `skipWaiting`, `clients.claim`, and update notification logic.
- The public license verification endpoint allowed 30 sequential invalid
  checks from this client; request 31 returned `429` with `Retry-After: 4`.

## Accessibility, responsive layout, and performance

- `npm run test:live:browser` passed on `/`, `/demo`, `/privacy`, `/terms`,
  `/offline`, and an unknown route: every route had one `main` and one `h1`,
  and Axe reported zero serious/critical findings. The same run confirmed
  history/focus restoration, visible 3 px focus on backup restore, 200% text
  with zero overflow, and reduced-motion duration of `0.00001s`.
- At 390 × 844, the sample action was fully visible (bottom 513 px), the
  review control bottom was 618 px, demo controls and compact wordmark met
  44 × 44 px, and horizontal overflow was zero. Keyboard Tab reached the skip
  link, demo controls, answer input, check button, forms, backup control and
  legal links; every observed focus outline was solid 3 px. Enter on the skip
  link focused `#main`.
- Link crawl: all internal pages and the Param Factory footer returned 200;
  the checkout returned 303; mailto and fragment links were correctly exempt.
- Built payloads: JS 37,104 B raw / 12,026 B gzip; CSS 16,320 B raw / 4,582 B
  gzip; mobile hero 16,214 B. All meet the static-PWA budgets.
- Fresh Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 20 ms, CLS 0. Report:
  `.factory/evidence/verification-4-lighthouse.json`.

## Findings by severity

No open critical, high, medium, or low findings. No release blockers found.

## Evidence

- Live browser output and screenshots:
  `.factory/evidence/verification-4/`.
- Fresh Lighthouse JSON:
  `.factory/evidence/verification-4-lighthouse.json`.
- Re-runnable deployed checks: `npm run test:live` and
  `LIVE_EVIDENCE_DIR=.factory/evidence/verification-4 npm run test:live:browser`.
