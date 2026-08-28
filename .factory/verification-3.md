# Independent verification 3 — Context Cloze

**Result: PASS — candidate `1219456c24017e3d1c44841b1b8543582a4f301a` is releasable.**

Verified on 2026-08-28 from a clean checkout at commit
`1219456c24017e3d1c44841b1b8543582a4f301a` against
<https://context-cloze-vocab.sociobot.in>. This replaces the failed
`verification-2.md` report for the prior candidate `9f7ac67`.

## First-read gate — PASS

A cold, fresh-browser visit to the live page says it is for independent
learners who recognise words but cannot retrieve them while writing or
speaking. The heading is **“Recall words inside sentences”**. The visible
first action is **“Try it with sample data”**, with adjacent plain copy:
“Opens eight sample words. Your vocabulary stays untouched.” Clicking it opens
the isolated eight-word demo in one click. The first screen therefore explains
what it does, for whom, and what to click first.

## Required claim tests — PASS

`.factory/claims.json` exists and contains 11 claims. After `npm ci`, I ran
every listed command individually from the clean checkout, through the shipped
demo entry point. All passed:

| Claim ID | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `typed-scheduling` | PASS |
| `case-insensitive-marking` | PASS |
| `full-session` | PASS |
| `unicode-rtl` | PASS |
| `json-export` | PASS |
| `confusion-pairs` | PASS |
| `local-storage` | PASS |
| `offline-reload` | PASS |
| `free-limit` | PASS |
| `paid-license` | PASS |

The repaired scheduling test exports before/after and asserts schedule changes;
the JSON test clears/reimports demo IndexedDB and compares full item/review
records; and the paid-license fixture proves 51 words and all four confusion
pairs. These address all three previous release blockers.

## Local quality gates — PASS

- `npm ci`: passed; audit reported 0 vulnerabilities.
- `npm test`: passed: 6 Vitest tests and 20 Chromium Playwright tests.
- `npm run build`: passed (`tsc --noEmit` plus Vite) and created `dist/`.
  Output: JavaScript 31.38 KB raw / 10.97 KB gzip; CSS 15.45 KB raw /
  4.41 KB gzip; hero WebP 16.21 KB mobile and 37.10 KB desktop. All are
  within the static/PWA budgets.
- There is no separate lint script. Type-checking is part of the exact build.
- `npm run test:live`: passed: home 200, designed unknown-route 404, checkout
  303 to hosted Dodo checkout, invalid license `valid: false`.

## Product and PWA exercise — PASS

Fresh live-browser testing covered the brief's real job:

- Demo opens with eight sample entries, a persistent isolation banner, Reset
  demo, and Start for real. A typed `ELUSIVE` answer marks correctly; resetting
  restores sample data; leaving demo returns to an empty real database.
- A real word whose sentence lacks that word gives the actionable inline error.
  A valid `staccato` word/sentence saves successfully. A malformed/wrong-product
  JSON file gives the recovery message “Choose a Context Cloze JSON export.”
- Shipped browser tests additionally passed full eight-word practice,
  Unicode/RTL save-and-answer, case folding, schedule persistence, JSON
  round-trip, confusion-pair counts, the 50-word boundary, and valid-license
  unlimited storage/full history.
- `/demo` registered and was controlled by the live service worker. After the
  first load, an offline reload retained “Practise sample words in context”.
  The worker has active scope `/`; source/build inspection confirms versioned
  caches, `skipWaiting`, `clientsClaim`, and update notice logic. A complete
  old-to-new live worker transition cannot be induced without changing the live
  deployment, so it was not forced.

## Accessibility, responsive, and performance — PASS

- `/opt/fleet/lib/verify-url.sh` passed against the live URL (804 ms): title,
  `lang=en`, one `h1`, `main`, image alt text, labelled buttons, and zero
  console/page errors. Evidence: `/tmp/context-cloze-verify-3/verify.json`.
- Independent live `@axe-core/playwright` scan of `/demo`: 0 violations,
  including 0 serious/critical. The full shipped suite also reports 0
  serious/critical issues for `/`, `/demo`, `/privacy`, `/terms`, and `/404.html`.
- Keyboard smoke: Tab reaches the visible skip link; Enter focuses `main`.
  The focus outline is intentionally styled amber and 3 px. Forms have labels
  and errors use live/alert regions.
- At 390 × 844, live `/demo` had 0 px horizontal overflow. Reset demo,
  Start for real, and compact Home measured at least 44 × 44 px. Visual review
  found no clipping. Reduced-motion emulation reduced animation duration to
  `0.00001s` and set scroll behavior to `auto`.
- Lighthouse mobile, live home (retry with supplied Chromium): Performance
  **99**, Accessibility **100**, FCP **1,701 ms**, LCP **1,701 ms**, CLS **0**,
  TBT **0 ms**.

## Deployment, privacy, and policies — PASS

- Candidate/build identity is confirmed by exact SHA-256 equality between local
  `dist/` and live hashed assets: JS
  `08a9a82e70505800d5110e535ec9adf6d163697697eaeadd84e3f39ce83e61f6`,
  CSS `45be5c1fa767a05986458b457798f6f524a3b1e2cb81cff2e23d999b81c307b2`,
  and desktop hero
  `069c0fe7aca019f7da8253fd0e8cb1298732c6080e75b4b3912a55801840c425`.
- Live `/`, `/demo`, `/privacy`, `/terms`, `/offline` return 200; an unknown
  path returns the designed 404. Crawled internal links return 200; the paid
  checkout link returns 303 to Dodo; mail links are explicit `mailto:`.
- HTML is short-revalidated; hashed `/assets/*` send
  `Cache-Control: public, max-age=31536000, immutable`. CSP is self-only
  except the documented Sociobot billing API; `nosniff`, strict-origin referrer
  policy, and restrictive Permissions-Policy are present.
- A full live demo practice flow emitted requests only to
  `https://context-cloze-vocab.sociobot.in` and no console errors. There are no
  third-party fonts, scripts, analytics, or sign-in. Real and demo vocabulary
  use separate IndexedDB databases. Billing verification is the documented
  optional exception and is tested with an invalid token.
- Rate limiting is present on the only server endpoint used by the product.
  A 60-request concurrent invalid-token verification burst returned 30 HTTP
  200 and 30 HTTP 429; the first observed 429 carried `Retry-After: 4`. After
  5.5 seconds, a sequential rapid probe received 200, 200, then 429 with
  `Retry-After: 2`. Because the bucket is shared, this records the observed
  threshold rather than claiming a globally exact capacity.

## Defects

No critical, high, medium, or low product defects found. The initial
`verify-url.sh` invocation needs a pre-created evidence directory; that is a
verification-harness usage detail, not a deployed product defect.

