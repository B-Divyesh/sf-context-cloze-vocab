# Independent verification 2 — Context Cloze

**Result: FAIL — do not release until the release-blocking claim tests are
corrected.**

Verified 2026-08-28 from clean checkout candidate
`9f7ac67c570683aefa8517a46c3f3844aada425e` against
`https://context-cloze-vocab.sociobot.in`.

## First read

Cold-loading the live page answers all three required questions in plain
words. It is a tool to “Recall words inside sentences,” for independent
learners who recognise words but cannot retrieve them while writing or
speaking. The first primary action is **Try it with sample data**, with adjacent
copy saying it opens eight sample words without touching the learner's
vocabulary. The one-click demo and first-read gates pass.

## Release-blocking finding

### High — three claimed behaviours are not actually proved by their claim tests

All 11 commands in `.factory/claims.json` exit successfully, but three of the
passing tests do not assert the observable outcome promised by their listed
claim. This violates the claims contract: every visitor-reliable claim must be
proved in the demo sandbox, not merely exercise nearby UI.

| Claim | Evidence of inadequate assertion | Required repair |
| --- | --- | --- |
| `typed-scheduling` | `tests/claims.spec.ts` answers `ELUSIVE`, then only asserts “Correct.” and “The answer is elusive.” It never observes the item's saved due date or schedule. | Export or inspect the demo record after the answer and assert its due date/interval changed as claimed. |
| `json-export` | The test asserts exported item/review counts and imports one replacement item. It never compares imported schedules or answer history with the exported values. | Round-trip an export into a fresh demo store and assert words, due schedule fields, and review records are preserved. |
| `paid-license` | The fixture verifies only the “Personal license active” UI and hides `/ 50 free`; it does not prove a 51st word can be stored or that the full confusion history becomes visible. | With a valid fixture license, add/import beyond 50 words and assert all confusion pairs appear. |

Independent exploratory testing confirms the scheduling implementation itself
works: after answering `LUMINOUS`, a live JSON export contained
`reviewCount: 1`, `intervalDays: 1`, a forward `dueAt`, and the correct review.
That does not make the shipped claim tests sufficient; regressions to those
states would still pass the required release commands.

## Other finding

### Medium — deployed static assets do not meet immutable-cache policy

The live `assets/app.js`, `assets/app.css`, hero image, and PWA icons use
unhashed stable names and return:

```
Cache-Control: public, must-revalidate, max-age=30
```

The service worker precache keeps offline reload working, but the PWA
performance contract requires content-hashed assets with long-lived immutable
caching. Emit hashed asset filenames and configure immutable cache headers for
them; keep short revalidation only for HTML and `sw.js`.

## Passing evidence

### Clean install, tests, and build

- `npm ci`: passed; npm audit reported 0 vulnerabilities.
- Each of the 11 exact commands listed in `.factory/claims.json` was run from
  the clean install and passed: `demo-isolation`, `typed-scheduling`,
  `case-insensitive-marking`, `full-session`, `unicode-rtl`, `json-export`,
  `confusion-pairs`, `local-storage`, `offline-reload`, `free-limit`, and
  `paid-license`.
- Exact `npm test`: passed — 5 Vitest unit tests and all 20 Chromium Playwright
  tests (40.3 s).
- `npm run build`: passed with `tsc --noEmit` and produced `dist/`. No separate
  lint script is present.
- `npm run test:live`: passed: home 200, unknown route 404, checkout 303 to
  `checkout.dodopayments.com`, invalid license `valid: false`.

### End-to-end behaviour

- Live demo starts with eight isolated sample words and persistent Reset demo /
  Start for real controls. Offline reload after the service worker controlled
  the page retained the demo heading and eight words.
- A real-word sentence missing the target word displays the actionable error
  “The sentence must include the exact word. Add it, then save again.” A valid
  Arabic word/sentence saves and marks correctly when typed.
- Case-insensitive typed recall, all-eight sample sessions, malformed JSON
  recovery, JSON export, import, confusion pairs, the free 50-word boundary,
  and fixture license display all passed their shipped browser tests.

### Live deployment, privacy, and browser checks

- Freshly built and deployed bytes match: SHA-256 `app.js`
  `c98d0bee394b6203409e910fd737d30cf89681470aed716a98ff7d4ef0e52101`,
  `app.css` `58d456c03cd82af40ff38a3f57f3c647e19e64c64fed0bdea207c8a50db218f4`,
  and `sw.js` `05f048fceb4b3749e8b25472900a6fcdc783196bfa0015768f7c0bb7b15c8ad5`.
- Cold home/demo browsing produced no console or page errors and no outbound
  requests. The documented billing API is the only runtime external endpoint
  when a license is checked. There are no third-party fonts, scripts, or
  analytics; vocabulary uses separate real/demo IndexedDB stores.
- Response policy includes HSTS, `nosniff`, strict-origin referrer policy,
  restrictive Permissions-Policy, and a self-only CSP with only the documented
  Sociobot billing API in `connect-src`.
- The billing verification endpoint rate-limits: an 80-request invalid-token
  concurrent burst observed 30 HTTP 200 and 50 HTTP 429 responses, each 429
  with `Retry-After: 4`. A follow-up while the window was still cooling down
  first returned 429 at request 6 with `Retry-After: 2`; observed capacity is
  therefore about 30 requests/window, not an exact isolated threshold.
- At 390 px there was no horizontal overflow. Keyboard Tab reaches the skip
  link with a visible `rgb(255, 217, 142) solid 3px` focus outline; Enter on
  the practice control opens the review and focuses its answer field. Reduced
  motion produced no active animations in the inspected view.
- Playwright Axe scans found zero serious/critical findings on all local
  routes; an independent live demo Axe scan also found zero. The standalone
  `@axe-core/cli` launcher could not find a system Chrome in this container, so
  Playwright's supplied Chromium and `@axe-core/playwright` were used instead.
- Lighthouse mobile audit of the live home: Performance 99, Accessibility 100,
  LCP 1,150 ms, CLS 0. Built payload: JS 31,335 B raw / 10,930 B gzip; CSS
  15,437 B raw / 4,390 B gzip; mobile hero 16,214 B.

## PWA update check

The live service worker registered and controlled `/demo`; offline reload
passed. Source inspection confirms versioned caches, `skipWaiting`,
`clientsClaim`, and an update-available notice on `updatefound`. No newer live
worker revision existed during this verification, so a full old-worker to
new-worker transition could not be induced against production without altering
the deployment.

## Reverification required

1. Strengthen the three claim tests above and rerun every command in
   `.factory/claims.json` from a clean install.
2. Use content-hashed generated assets and immutable asset cache headers.
3. Re-run `npm test`, `npm run build`, live/PWA checks, Axe, and the billing
   rate-limit probe before changing this result to PASS.
