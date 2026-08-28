# Context Cloze polish round 2 handoff

## Status

**PASS — every finding in review 1 and review 2 is closed.** The repaired
product commit is `b1d35773e977d0c7bb4143650eaad9d6df3e8603`, deployed to
<https://context-cloze-vocab.sociobot.in> through the static work-order path
(final Azure deployment `bceeb4ab-464b-4c4c-861d-0d62f8a9b47d`).

## What changed

- Strengthened `@claim:clear-site-data` so it creates named real/demo records
  and a license, proves both databases and the license key are absent before
  reload, then proves the real list is empty and the demo is freshly reseeded.
- Added `/?demo=1` as a true isolated-demo route. The first-screen action,
  README, demo contract, and claim sandbox use it; `/demo` remains canonical.
- Made the one-click demo claim verify the banner, Reset demo, Start for real,
  active question, eight-word sample, and direct-entry storage namespace.
- Fixed the mobile history focus/scroll race found during the first live cold
  check. Back now focuses the page heading without moving it and restores the
  saved offset instantly. The regression runs at 390 px and waits beyond the
  prior false-positive interval.
- Updated the catalog line to: “Practise your own words by typing them into
  sentence blanks.” It starts with a verb and is 60 characters before newline.
- Added deploy instructions, the cumulative finding map in
  `.factory/polish-2.md`, and committed local/live screenshots under
  `.factory/evidence/`.

The night-archive palette, clipped paper surfaces, generated environmental
scene, restrained motion, local-first IndexedDB model, and offline PWA class
are unchanged.

## Clean-clone verification

Final clean clone: `/tmp/context-cloze-polish2-final.DQKxa3` at
`b1d35773e977d0c7bb4143650eaad9d6df3e8603`.

- `npm ci`: passed; 0 vulnerabilities.
- Every one of the 19 exact commands in `.factory/claims.json`: passed
  individually. IDs: `demo-sample-count`, `demo-isolation`, `typed-cloze`,
  `typed-scheduling`, `due-queue`, `case-insensitive-marking`, `full-session`,
  `unicode-rtl`, `unicode-normalisation`, `backup-roundtrip`,
  `confusion-pairs`, `no-tracking-resources`, `local-storage`, `checkout-link`,
  `license-token-privacy`, `clear-site-data`, `offline-reload`, `free-limit`,
  and `paid-license`.
- `npm test`: passed — 6 Vitest unit/config tests and 32 Chromium browser
  tests. The browser suite includes all-route Axe, keyboard focus, 390 px
  layout/touch targets, history, privacy requests, storage isolation, offline
  reload, and claims.
- `npm run build`: passed and produced `dist/index.html`. Output: JavaScript
  32.90 KB raw / 11.26 KB gzip; CSS 15.66 KB raw / 4.45 KB gzip; mobile hero
  16.21 KB; desktop hero 37.10 KB.
- Local Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 906 ms, LCP 1,509 ms, CLS 0, TBT 41 ms.

## Final live verification

- Cold 390 px home explained the job and audience, and kept **Try it with
  sample data** in the first viewport. One click reached `/?demo=1` with the
  banner, seeded question, answer field, **Check answer**, reset, and exit.
- A direct fresh `/?demo=1` context created only `context-cloze-demo`. Reset
  removed a temporary ninth word; Start for real opened an empty real list.
  Offline reload retained the eight sample words.
- Repeated the full F-2-1 flow on live: after clearing site data, both app
  databases and the license key were absent before navigation; `/` showed zero
  words/no `keepsake`; demo reseeded eight words/no `discard-me`.
- `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and `/offline` returned 200.
  An unknown route returned the designed page with HTTP 404. Each route had
  one h1/main, its expected title, and zero serious/critical Axe findings.
- Route focus, metadata, Restore backup focus, 44 px demo controls, reduced
  motion, and 200% text were checked. At 200% the 390 px demo had 0 px
  horizontal overflow. Mobile Back restored `scrollY` from 5,218 to 5,218 and
  left the home h1 focused.
- Normal home/demo use emitted no console errors and no cross-origin requests.
  `npm run test:live` passed: home 200, unknown route 404, checkout 303 to
  `checkout.dodopayments.com`, and an invalid license remained locked.
- Live Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 922 ms, LCP 1,072 ms, CLS 0, TBT 51 ms.
- `/opt/fleet/lib/verify-url.sh` passed for home and `/?demo=1`: correct title,
  `lang=en`, one h1, main landmark, image alt text, and zero console errors.
- Deployed JavaScript SHA-256 matches local `dist`:
  `a1bcb070bdb09e23a8b878902a582edafa5fc3b7f500ea7b640e99615c92d6c5`.
  Hashed assets return `Cache-Control: public, max-age=31536000, immutable`.

Screenshots:

- `.factory/evidence/polish-2-live-home-390.png`
- `.factory/evidence/polish-2-live-demo-390.png`
- `.factory/evidence/polish-2-privacy.png`
- `.factory/evidence/polish-2-404.png`

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:live
```

For an individual visitor-facing claim, run its exact command from
`.factory/claims.json`. Use `npm run preview` to inspect `dist/` locally.

## Known gaps and next steps

None. No review finding, deferred minor item, stub, or TODO remains.
