# Polish round 2 — cumulative finding closure

Repair target: `9ae45c77f830d019e93e13fd5aca2c9ae9a1e52b`.
Review source: `6163e74ce691f92af7e9c0ea117bcb6aa278b452`.

Every review-1 repair remains present. Round 2 strengthens the browser-data
deletion proof and adds the controller-required `/?demo=1` entry without
changing the night-archive visual system or the offline PWA deployment class.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The demo still opens directly on a seeded blank, answer field, and **Check answer**; counts follow the exercise. | `@claim:demo-sample-count`; mobile screenshot `.factory/evidence/polish-2-demo-390.png`; live `/?demo=1` check. |
| F-1-2 | The hidden restore input still gives its visible label the designed 3 px amber focus ring. | `keyboard focus is visible on Restore backup`; full accessibility suite. |
| F-1-3 | The offline mark retains its compliant amber treatment and `/offline` remains in the Axe route set. | `accessibility smoke /offline`; live `/offline` Axe check. |
| F-1-4 | Live mobile checking exposed a delayed smooth-scroll/focus race. Popstate now focuses the restored page heading without scrolling it, then restores the saved offset instantly; the regression waits past the old false-positive interval at 390 px. | `back navigation restores the prior scroll position`; live 390 px Back check. |
| F-1-5 | Static route documents and the designed 404 retain route titles, descriptions, canonical, Open Graph, Twitter, and apple-touch metadata. | `every app route updates its share metadata`; `@regression:real-404`; live route/header crawl. |
| F-1-6 | Saving a word still creates a visible blank that accepts a typed answer. | `@claim:typed-cloze`. |
| F-1-7 | The eight-word sample statement remains inventoried and now tests the first-screen click into `/?demo=1`. | `@claim:demo-sample-count`. |
| F-1-8 | A due saved word still returns as a missing-word question. | `@claim:due-queue`. |
| F-1-9 | The untestable learning-outcome sentence remains replaced by **Review the words you confused.** | `.factory/copy-audit.md`; `@claim:confusion-pairs`. |
| F-1-10 | The unproved negative feature list remains removed; the page gives concrete sentence-ownership guidance. | `.factory/copy-audit.md`; mobile home screenshot `.factory/evidence/polish-2-home-390.png`. |
| F-1-11 | The unproved free-practice/export sentence remains removed; only the enforced 50-word limit is stated. | `@claim:free-limit`; claim/copy cross-check. |
| F-1-12 | The visible purchase label still names secure checkout; refund policy stays on Terms. | `@claim:checkout-link`; `npm run test:live`; live checkout redirect check. |
| F-1-13 | Composed and decomposed accented answers remain covered by a browser claim. | `@claim:unicode-normalisation`. |
| F-1-14 | Privacy wording still excludes advertising, analytics, and third-party fonts/scripts, backed by a multi-route request audit. | `@claim:no-tracking-resources`; live request log. |
| F-1-15 | License-token storage and its sole verification destination remain asserted. | `@claim:license-token-privacy`. |
| F-1-16 | The storage-deletion test now creates named real/demo records and a license, proves both databases and the key disappear before reload, then proves a clean real list and fresh demo reseed. | `@claim:clear-site-data`; same repair as F-2-1. |
| F-1-17 | Public controls remain **Download backup** and **Restore backup**; JSON and IndexedDB stay in secondary/developer notes. | `@claim:backup-roundtrip`; `.factory/copy-audit.md`. |
| F-1-18 | Section headings remain **Review words you confuse** and **Remove the 50-word limit**. | `.factory/copy-audit.md`; local home screenshot. |
| F-1-19 | **Word list** and British **practise** remain consistent across product copy and README. | `.factory/copy-audit.md`; source/copy cross-check. |
| F-1-20 | Checkout and Param Factory links still visibly state their external destinations. | `@claim:checkout-link`; live link crawl. |
| F-2-1 | Replaced the false-positive deletion assertion with observable pre-reload database absence, named-record absence in the real workspace, clean demo reseeding, and license-key deletion. | `@claim:clear-site-data`; full clean-clone claim run. |
| Controller demo path | Added `/?demo=1` as a real demo route alias, made it the landing CTA/README/catalog verifier path, canonicalised it to `/demo`, and proved a direct fresh context opens only `context-cloze-demo`. | `@claim:demo-sample-count`; `.factory/demo.md`; live `/?demo=1` cold check. |

## Evidence index

- Local screenshots: `.factory/evidence/polish-2-home-390.png`,
  `.factory/evidence/polish-2-demo-390.png`,
  `.factory/evidence/polish-2-privacy.png`, and
  `.factory/evidence/polish-2-404.png`.
- Live screenshots after deployment:
  `.factory/evidence/polish-2-live-home-390.png` and
  `.factory/evidence/polish-2-live-demo-390.png`.
- Exact test counts, bundle sizes, Lighthouse results, hashes, and live checks
  are recorded in `.factory/handoff.md`.

## Final result

The repaired product commit `b1d35773e977d0c7bb4143650eaad9d6df3e8603`
was deployed at <https://context-cloze-vocab.sociobot.in>. A final clean clone
passed all 19 exact claim commands, 6 unit/config tests, 32 browser tests, and
the production build. The live route/Axe/offline/privacy pass found no
remaining finding. Live Lighthouse scores are 100/100/100/100; the deployed
JavaScript matches local SHA-256
`a1bcb070bdb09e23a8b878902a582edafa5fc3b7f500ea7b640e99615c92d6c5`.
