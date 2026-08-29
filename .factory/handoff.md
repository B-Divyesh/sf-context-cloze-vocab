# Context Cloze — polish round 4 handoff

## Status

**PASS — all findings from review rounds 1–4 are closed.** The repair commit
`f64054aa830b8752587df37b9d0feaffda2b05cb` was pushed to `main` and deployed
to <https://context-cloze-vocab.sociobot.in> with the configured Azure Static
Web App deployment. The product remains a local-first offline PWA with its
night-archive visual system.

## What changed

- Made the checkout claim test real: it now checks the visible Sociobot link,
  requests that exact URL, and requires a 303 HTTPS Dodo checkout-session
  redirect.
- Added three missing claim entries and isolated browser tests for tab-separated
  bulk entry, due-only short sessions, and the exact three-pair free view.
- Replaced the last ambiguous headings with **Type the missing word** and
  **Page not found** in both the SPA and the static 404 response. Updated the
  static 404, copy, release, and live-route regressions accordingly.
- Preserved every earlier repair: direct isolated `/?demo=1`, demo banner/reset
  and exit, storage isolation, plain backup controls, legal pages, routing and
  metadata, focus/scroll restoration, mobile layout, privacy controls,
  offline reload, and hashed immutable PWA assets.
- Updated the catalog line to “Practise missing words in your own sentences.”
  (verb-first, 45 characters), the copy audit, claim inventory, and the round-4
  finding map.

## Exact verification evidence

Clean clone: `/tmp/context-cloze-polish4.50qrw6/repo` at `f64054a`.

- `npm ci`: passed; 61 packages installed; 0 vulnerabilities.
- Every one of the 22 exact commands declared in `.factory/claims.json`
  passed individually: `demo-sample-count`, `demo-isolation`, `typed-cloze`,
  `typed-scheduling`, `due-queue`, `case-insensitive-marking`, `full-session`,
  `unicode-rtl`, `unicode-normalisation`, `backup-roundtrip`,
  `confusion-pairs`, `no-tracking-resources`, `local-storage`,
  `checkout-link`, `tab-bulk-entry`, `due-session-only`,
  `free-confusion-limit`, `license-token-privacy`, `clear-site-data`,
  `offline-reload`, `free-limit`, and `paid-license`.
- `npm test`: passed — 10 Vitest unit/config/copy tests and 38 Chromium
  Playwright tests. This includes all-route Axe, keyboard focus, 390 px layout,
  direct demo entry, privacy/network checks, clear-site-data, and offline
  reload.
- `npm run build`: passed and produced `dist/index.html`. Initial JS is
  33.17 KB raw / 11.23 KB gzip; CSS is 15.85 KB raw / 4.48 KB gzip; mobile and
  desktop hero assets are 16.21 KB and 37.10 KB.
- Static deployment: `/opt/fleet/lib/deploy-static.sh context-cloze-vocab
  /work/repo/dist` succeeded (deployment ID
  `ae5e8a62-5633-439b-b6e7-9be2d5690189`).
- `npm run test:live`: passed. Home returned 200; an unknown URL returned 404
  with **Page not found**; checkout returned 303 to
  `checkout.dodopayments.com`; an invalid license stayed inactive.
- Deployed bytes match the local build: `index-TYOseg00.js` SHA-256 is
  `713ea1202a5f82b15b0b72c25e898b1d2a32a450d9e446e68b89bf70ea068500`
  and `style-C7sAJ7po.css` is
  `75b2e2f0082bd39698d940e251f0e643c78f17f81618d945077353e9c23bcfb7`.
  Both live hashed assets return `Cache-Control: public, max-age=31536000,
  immutable`; the live CSP permits only self and the documented Sociobot API.
- `npm run test:live:browser`: passed cold against production. `/`, `/demo`,
  `/privacy`, `/terms`, and `/offline` returned 200; unknown route returned
  404. Every route had one h1 and main landmark, zero serious/critical Axe
  issues, no console errors, and no normal external requests. It also passed
  demo isolation/reset/exit, direct offline reload, focus + Back scroll,
  200% text with 0 px overflow, and reduced motion. At 390 px, the home CTA
  ended at y=513 and demo’s answer controls at y=587.
- A separate cold production exercise rechecked the new review-4 behaviours:
  tab-separated demo bulk entry saved a ninth word, a due/future fixture ran a
  one-question due session, an unlicensed four-pair fixture rendered exactly
  three pairs, checkout returned its Dodo 303, and the static 404 had the new
  heading. Screenshots: `polish-4-live-tab-bulk.png`,
  `polish-4-live-due-session.png`, `polish-4-live-free-pairs.png`, and
  `polish-4-live-404.png`.
- `/opt/fleet/lib/verify-url.sh` passed for the home URL and `/?demo=1`.
  Evidence: `.factory/evidence/polish-4-verify-home/verify.json` and
  `.factory/evidence/polish-4-verify-demo/verify.json` (both show title,
  `lang=en`, one h1, main, image alt coverage, and zero errors).
- Live mobile Lighthouse report: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, CLS 0, TBT 50 ms. Evidence:
  `.factory/evidence/polish-4-lighthouse.json`.

Live screenshots are committed under `.factory/evidence/` with the
`polish-4-live-` prefix; the complete finding-to-change-to-evidence map is
in `.factory/polish-4.md`.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:live
npm run test:live:browser
```

Run an individual visitor-facing claim with the exact command in
`.factory/claims.json`. Set `LIVE_URL` for another deployed environment and
`LIVE_EVIDENCE_DIR` to write browser evidence elsewhere.

## Known gaps and next steps

None. No blocking, major, minor, or deferred review finding remains.
