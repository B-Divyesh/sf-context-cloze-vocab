# Independent verification — Context Cloze

**Result: FAIL — do not release.**

Verified on 2026-08-28 against candidate commit
`502c5b244638d39c6dc9d5fb23992d24f363614c` and
`https://context-cloze-vocab.sociobot.in`.

## First-read result

Cold-loaded the live home page in a new browser context. It plainly says that
Context Cloze lets independent learners recall words inside sentences, names
learners who recognise words but cannot retrieve them while writing or
speaking, and makes **Try it with sample data** the first action. The adjacent
copy says it opens eight sample words without touching the learner's
vocabulary. This passes the plain-words and one-click-demo gate.

## Blocking defect

### High — live paid checkout is unavailable

The live **Buy for $12 once** link targets:

```
https://api.sociobot.in/api/v1/products/context-cloze-vocab/checkout
```

Fresh `GET` and `HEAD` requests on 2026-08-28 returned HTTP `404`, with:

```json
{"error":"enabled factory product","status":404}
```

The app therefore advertises a one-time license that cannot be bought. This
breaks the paid path specified in the work order and the landing-page claim
that a $12 one-time license removes the free limit. Register/enable the
product at the Sociobot billing API, then smoke-test a hosted checkout and
return-token verification before release. The candidate's own prior handoff
also identified this registration as outstanding; fresh live evidence confirms
that it is still unresolved.

## Other defects

### Medium — mobile demo controls miss the 44 px touch-target baseline

At 390 x 844 on the live `/demo`, the persistent-demo-banner controls measure
34 px high (`Reset demo`: 87.2 x 34; `Start for real`: 95.6 x 34). The compact
mobile wordmark link measures 40 x 40 px. The accessibility contract requires
at least 44 x 44 px targets.

### Medium — unknown URLs are soft 404s

`GET https://context-cloze-vocab.sociobot.in/does-not-exist` returns HTTP 200
and the SPA's designed missing-page screen. The visual state is good, but the
site-structure contract requires a real 404 response/route. Configure the
static host response override and a 404 document while retaining the styled
way back.

### Medium — claim inventory is incomplete

The page says **“Capitalisation does not affect marking.”**, but
`.factory/claims.json` contains no claim with that statement. The existing
`typed-scheduling` test happens to use uppercase input, but its listed claim
only promises schedule updates. Claims policy requires every visitor-reliable
statement to be declared and tested under its own matching claim id. Audit the
remaining behavioural statements too (for example the full-session and
offline-state copy) and either add sandbox tests or remove the promises.

### Low — malformed JSON import shows a raw parser message

Uploading `{not json` produces `Expected property name or '}' in JSON at
position 1 (line 1 column 2)`. This is a browser/parser detail rather than a
plain-language explanation and next step. Replace it with an actionable error
such as “This file is not valid JSON. Choose a Context Cloze JSON export.”

## Evidence that passed

### Clean checkout, test, and build

- `npm ci`: passed; audit reported 0 vulnerabilities.
- All nine required `.factory/claims.json` commands were run individually from
  the clean checkout, using the shipped demo entry point. Every command passed:
  `demo-isolation`, `typed-scheduling`, `unicode-rtl`, `json-export`,
  `confusion-pairs`, `local-storage`, `offline-reload`, `free-limit`, and
  `paid-license`.
- `npm test`: passed (4 Vitest unit tests and 15 Playwright tests, including
  accessibility and 390 px layout coverage).
- `npm run build`: passed and produced `dist/`. No separate lint/type script
  exists; the build runs `tsc --noEmit`.

### Product workflow and recovery paths

- Real workspace: missing word/sentence and a sentence without the entered
  word are rejected with form errors; a valid word/sentence is saved.
- A wrong typed answer exposes the intended answer and reschedules the word;
  the application shows `Not this time. The answer is precise. You typed
  vague.`
- Malformed bulk text is rejected; the 50-word free-limit boundary passed its
  dedicated claim test.
- JSON export/import, demo isolation, Unicode and RTL practice, confusion
  pairs, and license-fixture activation all passed their dedicated claim tests.

### Live deployment, PWA, privacy, and security

- Live `index.html`, `assets/app.js`, `assets/app.css`, and `sw.js` match the
  candidate build byte-for-byte. SHA-256 for live and local `app.js`:
  `b20a0b4e55014de526dc7b8135daba0be3bfb442de44a41e0c5e5ce5cae194bf`.
- A fresh live `/demo` install registered `context-cloze-v3`; with the browser
  offline, reload preserved the sample page and its eight words without errors.
- No console/page errors or cross-origin requests occurred during ordinary
  home/demo/privacy/terms loads. The only observed optional external request
  was the documented `api.sociobot.in` verification request after supplying a
  license token; it returned the invalid-license state cleanly.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, restrictive Permissions-Policy, and a CSP permitting only
  self plus the documented billing API. There are no third-party scripts or
  fonts. The live billing verify endpoint rate-limited a rapid invalid-token
  burst: requests 1–29 returned 200, request 30 first returned 429, and the
  response contained `Retry-After: 3`.
- Note for follow-up: static app assets currently send `Cache-Control: public,
  must-revalidate, max-age=30`, rather than long-lived immutable caching. The
  service worker precache keeps the installed/offline path working, but deploy
  caching should be aligned with the stated PWA policy when assets are
  content-hashed.

### Accessibility, responsive behavior, and performance

- Live axe scans found no serious or critical violations on `/`, `/demo`,
  `/privacy`, `/terms`, or the missing-page screen. Each had one `h1` and one
  `main`; `lang`, title, skip link, focus outline, landmarks, and image alt
  text were present.
- At 390 px there was no horizontal overflow. Keyboard Tab lands on the skip
  link with a 3 px visible outline; Enter on the focused practice button opens
  a review. At 200% text size the reviewed mobile screen still had no horizontal
  overflow. Reduced-motion mode reduced the hero animation duration to 0.01 ms.
- Lighthouse 12.8.2 on the live home page: Performance 100, Accessibility 100,
  Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, CLS 0, TBT 80 ms.
- Built payload: `app.js` 30,990 B raw / 10,824 B gzip; `app.css` 15,426 B raw
  / 4,398 B gzip; mobile hero WebP 16,214 B. These are within the static-PWA
  bundle and image budgets.

## Reverification required

1. Enable the registered billing product and verify real checkout, return URL,
   and purchased-license validation on the deployed URL.
2. Correct the 44 px mobile target sizes, real HTTP 404 handling, claims
   inventory, and JSON-import recovery copy.
3. Re-run all claim commands, `npm test`, `npm run build`, live axe/PWA checks,
   and the billing burst/checkout checks.
