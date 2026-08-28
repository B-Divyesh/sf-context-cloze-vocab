# Context Cloze polish round 1 handoff

## Status

**PASS.** All findings F-1-1 through F-1-20 from `review-1.md` are closed.
The repair was committed as `726d7b2711966844f3c0a69615c8e58359bebe83` and
the final metadata correction as `de7e46dc0c48f945f14500ab5ae3fc125289bfa4`.
Both are pushed to `origin/main`.

## What changed

- `/demo` opens immediately on a seeded missing-word exercise with an answer
  field, persistent isolated-demo banner, reset, and exit controls.
- Every visitor-facing promise is either in `.factory/claims.json` with an
  observable test or removed. The inventory has 19 isolated claim tests.
- Rewrote first-screen, backup, privacy, paid, README, headings, and footer
  copy in plain language; standardised on “word list” and “practise.”
- Fixed visible backup-control focus, offline contrast, back/forward scroll,
  all route metadata, static route documents, 404 metadata, and visible
  external-link labels.
- Preserved the night-archive visual system; the first mobile demo viewport is
  captured at `/tmp/context-cloze-polish/live-demo-mobile.png`.

## Verification evidence

- Fresh clone: `/tmp/context-cloze-clean.848RiZ`; `npm ci` passed with 0
  vulnerabilities.
- Every exact command declared in `.factory/claims.json` passed individually:
  `demo-sample-count`, `demo-isolation`, `typed-cloze`, `typed-scheduling`,
  `due-queue`, `case-insensitive-marking`, `full-session`, `unicode-rtl`,
  `unicode-normalisation`, `backup-roundtrip`, `confusion-pairs`,
  `no-tracking-resources`, `local-storage`, `checkout-link`,
  `license-token-privacy`, `clear-site-data`, `offline-reload`, `free-limit`,
  and `paid-license`.
- Local `npm test`: PASS — 6 unit tests and 32 Chromium tests, including Axe on
  `/`, `/demo`, `/privacy`, `/terms`, `/offline`, and `/404.html`; keyboard,
  mobile, metadata, scroll-restoration, privacy, and offline coverage pass.
- Local `npm run build`: PASS — `dist/` generated; initial JS 11.19 KB gzip,
  CSS 4.45 KB gzip.
- Local `/opt/fleet/lib/verify-url.sh`: PASS — title, language, one h1, main,
  image alt text, labelled buttons, and no console errors.
- `npm run test:live`: PASS — live home 200, unknown route 404, hosted Dodo
  checkout redirect 303, invalid license rejected.
- Deployed with `/opt/fleet/lib/deploy-static.sh context-cloze-vocab dist`.
  Azure deployments `0cbea20d-f4b3-4e34-927f-7f43d984531d` and final
  `903b7822-f398-45af-a2bb-839eb010804d` succeeded; the
  custom domain is ready and HTTPS returns 200.

## Live recheck

Cold `https://context-cloze-vocab.sociobot.in/demo` returns “Demo — Context
Cloze”, a route-specific canonical/OG/Twitter payload, and the one-question
demo on a 390 px screenshot. The live root verifier passed with no page or
console errors. The live route image URL was rechecked after deployment as
`/context-cloze-og.jpg` (not a rewritten route path).

## Known gaps

None.
