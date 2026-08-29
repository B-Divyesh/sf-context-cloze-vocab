# Polish round 4 — cumulative finding closure

Repair target: `4641519f0d7869e005cf4a5a89229efa9e3dbdb7`.
Review source: `70f700b6f0ee1252dfe50ea282dd2fb31a3037d1`.
Repair commit: `f64054aa830b8752587df37b9d0feaffda2b05cb`.
Deployed URL: <https://context-cloze-vocab.sociobot.in>.

Every earlier finding was rechecked, not merely assumed closed. “Live browser”
below is `npm run test:live:browser` against a cold production origin. Its
screenshots are in `.factory/evidence/polish-4-live-*.png`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Direct `/?demo=1` still opens a seeded blank, answer field, and Check answer in the first phone view. | `@claim:demo-sample-count`; `polish-4-live-demo-390.png`; live `/?demo=1`. |
| F-1-2 | Restore backup retains the visible 3 px amber `:focus-within` ring. | `keyboard focus is visible on Restore backup`; `polish-4-live-home-390.png`; live `/`. |
| F-1-3 | Offline mark remains contrast-safe and `/offline` stays in the Axe route set. | `accessibility smoke /offline`; live `/offline`; live browser Axe 0 serious/critical. |
| F-1-4 | History entries preserve scroll and focus restored headings without scrolling them away. | `back navigation restores the prior scroll position`; live `/` → `/privacy` → Back. |
| F-1-5 | Static routes and 404 keep route-specific title, canonical, Open Graph, Twitter, and apple-touch metadata. | `every app route updates its share metadata`, `@regression:real-404`; `polish-4-live-404.png`; live `/demo`, `/privacy`, `/terms`, `/offline`, and unknown URL. |
| F-1-6 | Saved words still become typed sentence blanks. | `@claim:typed-cloze`; `polish-4-live-home-390.png`; live `/?demo=1`. |
| F-1-7 | The stated sample size remains measured from a fresh direct demo. | `@claim:demo-sample-count`; `polish-4-live-demo-390.png`; live `/?demo=1` shows 8 words. |
| F-1-8 | Due words still return as missing-word questions. | `@claim:due-queue`; `polish-4-live-demo-390.png`; live `/?demo=1`. |
| F-1-9 | The untestable learning-outcome sentence remains replaced by a direct review instruction. | `tests/copy.test.ts`, `@claim:confusion-pairs`; `polish-4-live-home-390.png`; live `/`. |
| F-1-10 | The exhaustive negative feature list remains removed. | `tests/copy.test.ts`; `polish-4-live-home-390.png`; live `/`. |
| F-1-11 | The unproved free-practice/export promise remains removed; the enforced 50-word limit is the stated free limit. | `@claim:free-limit`; `polish-4-live-home-390.png`; live `/`. |
| F-1-12 | The purchase control names checkout; unproved billing/refund assertions remain replaced by support guidance. | `@claim:checkout-link`, `npm run test:live`; `polish-4-live-terms.png`; live checkout returns 303. |
| F-1-13 | Composed and decomposed accented answers still match. | `@claim:unicode-normalisation`; `polish-4-live-demo-390.png`; live `/?demo=1`. |
| F-1-14 | The privacy statement remains backed by a multi-route resource/request audit. | `@claim:no-tracking-resources`; live browser `externalRequests: []`; live `/privacy`. |
| F-1-15 | Returned license tokens still use namespaced browser storage and only the Sociobot verifier. | `@claim:license-token-privacy`; live CSP check; live `/privacy`. |
| F-1-16 | Storage clearing still proves both databases and the license disappear before reload. | `@claim:clear-site-data`; live browser `clearSiteData: true`; live `/` and `/?demo=1`. |
| F-1-17 | Public backup controls remain plain-language Download backup and Restore backup. | `@claim:backup-roundtrip`; `polish-4-live-home-390.png`; live `/`. |
| F-1-18 | The confusion and license sections retain plain headings. | `tests/copy.test.ts`; `polish-4-live-home-390.png`; live `/`. |
| F-1-19 | “Word list” and British “practise” remain consistent. | `tests/copy.test.ts`, `.factory/copy-audit.md`; live `/`. |
| F-1-20 | Checkout and Param Factory links visibly identify their external destinations. | `@claim:checkout-link`; live browser destination assertions; live `/`. |
| F-2-1 | The deletion proof still checks database/key absence before clean real and demo reloads. | `@claim:clear-site-data`; live browser `clearSiteData: true`; live `/` and `/?demo=1`. |
| F-3-1 | Demo mode still clears real-mode state before rendering and proves no real-list read or write. | `@claim:demo-isolation`; `polish-4-live-demo-390.png`; live `/?demo=1`. |
| F-3-2 | The how-to section retains the plain “Practice steps” label. | `tests/copy.test.ts`; `polish-4-live-home-390.png`; live `/`. |
| F-3-3 | The confusion label remains “Wrong answers.” | `tests/copy.test.ts`, `@claim:confusion-pairs`; `polish-4-live-demo-390.png`; live `/?demo=1`. |
| F-3-4 | Hero caption remains a direct add-word/add-sentence instruction. | `tests/copy.test.ts`, `@claim:typed-cloze`; `polish-4-live-home-390.png`; live `/`. |
| F-3-5 | Public generated-art originality copy remains removed; provenance stays in the design record. | `tests/copy.test.ts`; `polish-4-live-home-390.png`; live `/`. |
| F-3-6 | Paid and Terms copy retain the plain support route instead of unproved merchant/refund statements. | `paid panel links to license terms and a plain support address`; `polish-4-live-terms.png`; live `/terms`. |
| F-3-7 | The ownership section remains labelled “Your content and storage.” | `tests/copy.test.ts`; `polish-4-live-home-390.png`; live `/`. |
| F-4-1 | The checkout claim now requests the exact visible Sociobot endpoint and requires a 303 HTTPS Dodo session location. | `@claim:checkout-link`; `polish-4-live-home-390.png`; live `npm run test:live` reports checkout 303 to `checkout.dodopayments.com`. |
| F-4-2 | Tab-separated bulk entry is now a declared claim with an observable paste/save test. | `@claim:tab-bulk-entry`; `polish-4-live-tab-bulk.png`; live `/?demo=1` saved `tenacious` as the ninth demo word. |
| F-4-3 | The due-only short-session statement is now declared and tested with a due/future two-word fixture. | `@claim:due-session-only`; `polish-4-live-due-session.png`; live `/` showed the one due question as Sentence 1 of 1. |
| F-4-4 | The three-pair free-view limit is now declared and tested with four unlicensed pairs. | `@claim:free-confusion-limit`; `polish-4-live-free-pairs.png`; live `/` rendered exactly three pairs. |
| F-4-5 | “Type what belongs” became “Type the missing word”; both SPA and static 404 now say “Page not found.” | `tests/copy.test.ts`, `@regression:real-404`; `polish-4-live-404.png`; live unknown URL returns HTTP 404. |

## Verification

- Clean clone: `/tmp/context-cloze-polish4.50qrw6/repo` at repair commit
  `f64054a`. `npm ci` installed 61 packages with 0 vulnerabilities.
- All 22 exact commands from `.factory/claims.json` passed individually.
- `npm test` passed: 10 Vitest unit/config/copy tests and 38 Chromium browser
  tests. `npm run build` passed and wrote `dist/index.html`.
- `npm run test:live` passed: home 200, unknown route 404, checkout 303 to a
  Dodo session, and invalid license rejected.
- `npm run test:live:browser` passed cold production checks: all public routes
  200, unknown route 404, zero serious/critical Axe issues, no console errors
  or normal external requests, isolation/reset/exit, offline reload, focus,
  Back scroll, 200% text without overflow, and reduced motion.
- `/opt/fleet/lib/verify-url.sh` passed for `/` and `/?demo=1`; raw reports
  and screenshots are under `polish-4-verify-home/` and `polish-4-verify-demo/`.
- Mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.0 s, LCP 1.1 s, CLS 0, TBT 50 ms. Report:
  `.factory/evidence/polish-4-lighthouse.json`.
