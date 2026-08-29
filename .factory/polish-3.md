# Polish round 3 — cumulative finding closure

Repair target: `4c576aab35ad4b9898db9e89c9db036fc0ac90db`.
Review source: `eabb7d6a9652c51aa65ddc9c47a546d44e2533da`.
Deployed code: `3907ecbec4cf16a9321d7f3da90f1c98044c4506` at
<https://context-cloze-vocab.sociobot.in>.

Every finding from review rounds 1–3 was rechecked. “Live browser” below means
`npm run test:live:browser`; it tests production with fresh browser contexts.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | `/?demo=1` opens on one seeded missing-word question, answer field, and **Check answer**. Counts follow the exercise. | `@claim:demo-sample-count`; `mobile layout keeps controls within a 390px viewport`; `.factory/evidence/polish-3-live-demo-390.png`; live browser `demoLastControlBottom: 564`. |
| F-1-2 | **Restore backup** retains a visible 3 px dark-amber `:focus-within` ring on paper surfaces. | `keyboard focus is visible on Restore backup`; live browser `restoreBackupFocus: solid 3px rgb(111, 67, 17)` at `/`. |
| F-1-3 | The offline mark uses compliant amber, and `/offline` remains in every Axe route pass. | `accessibility smoke /offline`; live browser `/offline`: 0 serious/critical Axe findings. |
| F-1-4 | History entries save scroll; popstate focuses the h1 without scrolling it and restores the offset. | `back navigation restores the prior scroll position`; live browser `focusAndHistory: true` at `/` ↔ `/privacy`. |
| F-1-5 | Home, demo, privacy, terms, offline, and 404 retain route titles, descriptions, canonicals, Open Graph/Twitter data, and real HTTP routing. | `every app route updates its share metadata`; `@regression:real-404`; live browser route/metadata map; `.factory/evidence/polish-3-live-404.png`. |
| F-1-6 | Saving a word creates a visible blank that accepts the typed word. | `@claim:typed-cloze`; clean-clone claim pass; live `/` product desk. |
| F-1-7 | The eight-word statement remains inventoried and measured from a fresh direct demo. | `@claim:demo-sample-count`; live `/?demo=1` shows **8 words**; demo screenshot above. |
| F-1-8 | A due saved word returns as a missing-word question. | `@claim:due-queue`; live demo’s seeded due question in the demo screenshot. |
| F-1-9 | The untestable learning outcome remains replaced by **Review the words you confused.** | `tests/copy.test.ts`; `@claim:confusion-pairs`; live `/` copy inspection. |
| F-1-10 | The exhaustive negative feature claim remains removed. The page gives only concrete content/storage instructions. | `tests/copy.test.ts`; `.factory/copy-audit.md`; `.factory/evidence/polish-3-live-home-390.png`. |
| F-1-11 | The unproved free-practice/export sentence remains removed; only the enforced 50-word limit is stated. | `@claim:free-limit`; live `/` pricing copy. |
| F-1-12 | Checkout is a listed claim. Unproved merchant/refund statements are removed; support is now the stated next action. | `@claim:checkout-link`; `npm run test:live` proves the 303 hosted checkout; `.factory/evidence/polish-3-live-terms.png`. |
| F-1-13 | Composed and decomposed accented answers are tested through the browser. | `@claim:unicode-normalisation`; clean-clone claim pass. |
| F-1-14 | The privacy statement is backed by a multi-route resource/request audit. | `@claim:no-tracking-resources`; live browser reports `externalRequests: []` and `consoleErrors: []`. |
| F-1-15 | Returned license tokens are checked in the namespaced browser key and only on the Sociobot verification request. | `@claim:license-token-privacy`; clean-clone claim pass; live security headers allow only the documented API. |
| F-1-16 | Site-data deletion proves both databases and the license disappear before fresh real/demo loads. | `@claim:clear-site-data`; live browser `clearSiteData: true`. |
| F-1-17 | Public actions remain **Download backup** and **Restore backup**; implementation names stay in format/developer notes. | `@claim:backup-roundtrip`; `.factory/copy-audit.md`; live `/` copy inspection. |
| F-1-18 | The section is plainly labelled **Wrong answers** and headed **Confusion pairs**. | `@claim:confusion-pairs`; live browser rejects **Close calls** and requires **Wrong answers** on `/demo`. |
| F-1-19 | **Word list** and British verb **practise** remain consistent. | `tests/copy.test.ts`; `.factory/copy-audit.md`; live route copy inspection. |
| F-1-20 | Checkout and Param Factory links visibly identify real external destinations. | `@claim:checkout-link`; `npm run test:live`; live browser destination assertions for `api.sociobot.in` and `hello-factory.sociobot.in`. |
| F-2-1 | The deletion proof still creates named real/demo records plus a license, checks database/key absence, then checks clean real and reseeded demo views. | `@claim:clear-site-data`; live browser `clearSiteData: true`; live `/` and `/?demo=1`. |
| F-3-1 | `demo-isolation` now states and proves no read and no write. It creates real `keepsake`, watches every DOM mutation during the mode switch, checks both databases, adds/reset demo `temporary`, and proves exit clears demo only. Mode changes now clear items, reviews, and notices before the first render. | `@claim:demo-isolation`; live browser reports `realWordsAfterDemo: [keepsake]`, `demoWordsAfterExit: []`; `.factory/evidence/polish-3-live-demo-390.png` contains no real-word toast. |
| F-3-2 | **A small daily loop** became **Practice steps**. | `tests/copy.test.ts`; `.factory/copy-audit.md`; live browser requires the new text at `/`. |
| F-3-3 | **Close calls** became **Wrong answers**. | `tests/copy.test.ts`; `@claim:confusion-pairs`; live `/demo` copy assertion. |
| F-3-4 | The caption now says **Add a word and a sentence. Context Cloze hides the word.** | `tests/copy.test.ts`; `@claim:typed-cloze`; live browser exact-copy assertion at `/`. |
| F-3-5 | The public originality/generated-art statement was removed from the footer and README. Provenance remains only in `.factory/design.md`. | `tests/copy.test.ts`; live browser rejects **Original generated scene**; live home screenshot. |
| F-3-6 | Merchant/refund handling and revocation claims were replaced on the paid panel and Terms with a plain support email. The paid panel links Terms directly. | `tests/copy.test.ts`; `paid panel links to license terms and a plain support address`; `.factory/evidence/polish-3-live-terms.png`; live `/terms`. |
| F-3-7 | **A quiet tool, not a course** became **Your content and storage**. | `tests/copy.test.ts`; `.factory/copy-audit.md`; live browser requires the new text at `/`. |

## Additional cold-live correction

The first post-deploy screenshot revealed a transient real-word notice while
switching from home to demo. That was not left as a minor issue. Commit
`3907ecb` clears mode-specific arrays and notices before demo’s first render.
The claim test and live verifier now observe every DOM mutation during the
switch, so even a brief recurrence fails. The final live demo screenshot is
clean.

## Evidence index

- Local: `.factory/evidence/polish-3-home-390.png`,
  `.factory/evidence/polish-3-demo-390.png`,
  `.factory/evidence/polish-3-privacy.png`,
  `.factory/evidence/polish-3-terms.png`, and
  `.factory/evidence/polish-3-404.png`.
- Live: `.factory/evidence/polish-3-live-home-390.png`,
  `.factory/evidence/polish-3-live-demo-390.png`,
  `.factory/evidence/polish-3-live-privacy.png`,
  `.factory/evidence/polish-3-live-terms.png`, and
  `.factory/evidence/polish-3-live-404.png`.
- Final clean clone: `/tmp/context-cloze-polish3-final.5PRxEl/repo` at
  `3907ecbec4cf16a9321d7f3da90f1c98044c4506`.
- All 19 exact commands in `.factory/claims.json`: PASS.
- `npm test`: 9 unit/config/copy tests and 35 Chromium tests: PASS.
- `npm run build`, `npm run test:live`, `npm run test:live:browser`, both
  `verify-url.sh` checks, live Lighthouse, and deployed-byte hashes: PASS.

No review finding remains open.
