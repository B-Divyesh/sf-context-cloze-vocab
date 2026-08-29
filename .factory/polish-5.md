# Polish round 5 — cumulative finding closure

Repair target: `66c2db69ca894494e92ce33e445ae6cbffb0c460`.
Review source: `949d8ea5edbf5e78ecf0b90ff0425bffde105a81`.
Deployed application commit: `81594fd9b9a579fe143b410ea20a1e496b53b1ca`.
Live URL: <https://context-cloze-vocab.sociobot.in>.

Every finding from review rounds 1–5 was checked in source, in a clean clone,
and on a cold production origin. The live checks below were run after Azure
Static Web Apps deployment `635145ec-46d1-4dc5-a57c-af7de116ba6a`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | `/?demo=1` still opens on a seeded missing-word question, answer field, and **Check answer** without a second action. | `@claim:demo-sample-count`; `.factory/evidence/polish-5-live-demo-390.png`; cold live `/?demo=1` put the last core control at y=587. |
| F-1-2 | **Restore backup** retains its visible 3 px dark-amber focus ring. | `keyboard focus is visible on Restore backup`; `.factory/evidence/polish-5-live-home-390.png`; live `/` computed `solid 3px rgb(111, 67, 17)`. |
| F-1-3 | The offline mark remains contrast-safe and `/offline` remains in the Axe route suite. | `accessibility smoke /offline`; live `/offline` reported 0 serious/critical Axe findings. |
| F-1-4 | Back restores the prior scroll offset while focusing the restored h1 without moving it. | `back navigation restores the prior scroll position`; live `/` → `/privacy` → Back returned focus and scroll. |
| F-1-5 | Home, demo, privacy, terms, offline, and 404 retain route-specific title, description, canonical, Open Graph, Twitter, and apple-touch metadata with real HTTP routing. | `every app route updates its share metadata`; `@regression:real-404`; `.factory/evidence/polish-5-live-404.png`; live route map returned 200/404 as designed. |
| F-1-6 | Saving a complete word still creates a visible blank that accepts a typed answer. | `@claim:typed-cloze`; `.factory/evidence/polish-5-live-demo-390.png`; live `/?demo=1`. |
| F-1-7 | The eight-word sample statement remains inventoried and measured from a fresh direct demo. | `@claim:demo-sample-count`; live `/?demo=1` showed **8 words** before changes. |
| F-1-8 | A due complete word still returns as a missing-word question. | `@claim:due-queue`; live demo question in `.factory/evidence/polish-5-live-demo-390.png`. |
| F-1-9 | The untestable learning-outcome sentence remains replaced by a direct review instruction. | `tests/copy.test.ts`; `@claim:confusion-pairs`; live `/` copy check. |
| F-1-10 | The unproved exhaustive negative-feature list remains absent. | `tests/copy.test.ts`; `.factory/copy-audit.md`; live `/` copy check. |
| F-1-11 | The unproved free-practice/export promise remains absent; only the enforced 50-word limit is stated. | `@claim:free-limit`; `.factory/evidence/polish-5-live-home-390.png`; live `/`. |
| F-1-12 | Checkout is an observable claim; unproved merchant/refund claims remain replaced by support guidance. | `@claim:checkout-link`; `npm run test:live`; live endpoint returned 303 to `checkout.dodopayments.com/session/`. |
| F-1-13 | Composed and decomposed accented answers still match in the browser. | `@claim:unicode-normalisation`; clean-clone claim run; live CSP and local browser flow. |
| F-1-14 | The privacy statement remains backed by a multi-route resource and request audit. | `@claim:no-tracking-resources`; `.factory/evidence/polish-5-live-privacy.png`; live verifier recorded `externalRequests: []`. |
| F-1-15 | Returned license tokens still use namespaced browser storage and only the Sociobot verifier. | `@claim:license-token-privacy`; live CSP allows the documented API only; live `/privacy`. |
| F-1-16 | Site-data clearing still proves both app databases and the license disappear before clean reloads. | `@claim:clear-site-data`; live verifier reported `clearSiteData: true`. |
| F-1-17 | Public backup actions remain **Download backup** and **Restore backup**; implementation format stays in developer notes. | `@claim:backup-roundtrip`; `tests/copy.test.ts`; live `/` screenshot `.factory/evidence/polish-5-live-home-390.png`. |
| F-1-18 | Confusion and license sections retain plain, specific headings. | `tests/copy.test.ts`; `@claim:confusion-pairs`; live `/` and `/?demo=1`. |
| F-1-19 | **Word list** and British **practise** remain consistent in public copy. | `tests/copy.test.ts`; `.factory/copy-audit.md`; live route copy check. |
| F-1-20 | Checkout and Param Factory links visibly identify their external destinations. | `@claim:checkout-link`; live crawl returned checkout 303 and Param Factory 200. |
| F-2-1 | The deletion proof still creates real/demo records plus a license, proves database/key absence, then proves clean real and newly seeded demo states. | `@claim:clear-site-data`; live `/` and `/?demo=1`; verifier `clearSiteData: true`. |
| F-3-1 | Demo mode still clears real-mode state before rendering and proves no real-list read or write. New bare words also remain demo-only. | `@claim:demo-isolation`; `@claim:word-list-paste`; live verifier retained real `keepsake`, cleared demo on exit, and exposed no real word in demo mutations. |
| F-3-2 | The how-to section remains labelled **Practice steps**. | `tests/copy.test.ts`; `.factory/copy-audit.md`; live `/`. |
| F-3-3 | The confusion label remains **Wrong answers**. | `tests/copy.test.ts`; `@claim:confusion-pairs`; live `/?demo=1`. |
| F-3-4 | The hero caption remains the direct instruction **Add a word and a sentence. Context Cloze hides the word.** | `tests/copy.test.ts`; `@claim:typed-cloze`; `.factory/evidence/polish-5-live-home-390.png`. |
| F-3-5 | Public generated-art originality copy remains absent; provenance stays only in `.factory/design.md`. | `tests/copy.test.ts`; live `/` copy check. |
| F-3-6 | Paid and Terms copy retain the direct support route instead of unproved merchant/refund handling statements. | `paid panel links to license terms and a plain support address`; `.factory/evidence/polish-5-live-terms.png`; live `/terms`. |
| F-3-7 | The ownership section remains labelled **Your content and storage**. | `tests/copy.test.ts`; `.factory/copy-audit.md`; live `/`. |
| F-4-1 | The checkout claim requests the visible Sociobot endpoint and requires its HTTPS Dodo session redirect. | `@claim:checkout-link`; `npm run test:live`; live checkout returned 303. |
| F-4-2 | Tab-separated paired entry remains a declared, observable feature. | `@claim:tab-bulk-entry`; live `/?demo=1`; paired-entry control remains beside the new bare-list path. |
| F-4-3 | Due-only short sessions remain tested with one due and one future word. | `@claim:due-session-only`; clean-clone claim run; live demo due question. |
| F-4-4 | The three-pair unlicensed view remains declared and measured. | `@claim:free-confusion-limit`; clean-clone claim run; live `/?demo=1` confusion panel. |
| F-4-5 | The practice step says **Type the missing word** and both 404 implementations say **Page not found**. | `tests/copy.test.ts`; `@regression:real-404`; `.factory/evidence/polish-5-live-404.png`; live unknown route returned HTTP 404. |
| F-5-1 | Added one-word-per-line paste. Bare words become local pending records, the first sentence field receives focus, saving advances in insertion order, incomplete words stay out of practice, backups preserve them, and demo use never opens real storage. | `@claim:word-list-paste`; `@claim:backup-roundtrip`; `pasted-word sentence queue is accessible at 390px`; `.factory/evidence/polish-5-live-word-list-390.png`; cold live `/?demo=1` created 11 demo words and advanced **zealous** → **resilient** with 0 Axe findings. |
| F-5-2 | Removed **Backup files use JSON format** from the public panel and kept format detail only in README developer notes. | `keeps file-format jargon out of the public product panel`; `.factory/copy-audit.md`; live `/` verifier asserted the phrase is absent. |

## Verification

- Clean clone: `/tmp/context-cloze-polish5-claims.MqK0U3/repo` at
  `81594fd9b9a579fe143b410ea20a1e496b53b1ca`.
- All 23 exact commands in `.factory/claims.json` passed individually.
- `npm test` passed 12 Vitest unit/config/copy tests and 40 Chromium browser
  tests. `npm run build` produced `dist/index.html`.
- Production assets: 12.09 KB gzip JavaScript and 4.57 KB gzip CSS. The live
  JavaScript SHA-256 matches local:
  `f2f1f3b90bce178f0edfec3aa60f79d62c035082383ea727d28031042545e639`.
- `npm run test:live` and `npm run test:live:browser` passed after deployment:
  route status/metadata, real 404, hosted checkout, invalid license, all-route
  Axe, no console errors, no normal cross-origin requests, demo reset/exit,
  word-list isolation, offline reload, focus/Back, storage clearing, 200% text,
  and reduced motion.
- `/opt/fleet/lib/verify-url.sh` passed `/` and `/?demo=1`; reports are in
  `.factory/evidence/polish-5-verify-home/` and
  `.factory/evidence/polish-5-verify-demo/`.
- Mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 90 ms, CLS 0. Report:
  `.factory/evidence/polish-5-lighthouse.json`.

No finding remains open.
