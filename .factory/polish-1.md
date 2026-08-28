# Polish round 1 — finding closure

Repair target: `1219456c24017e3d1c44841b1b8543582a4f301a`.
Review source: `0757512cba7dd619f19e61bf46cde850e7c63ab6`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | `/demo` now opens directly on a seeded blank, answer field, and Check answer action; the counts move below the exercise. | `@claim:demo-sample-count`; `tests/accessibility.spec.ts` mobile demo check; `/tmp/context-cloze-polish/demo-mobile.png` |
| F-1-2 | Restore backup uses `.file-label:focus-within` with the designed amber focus ring. | `keyboard focus is visible on Restore backup` |
| F-1-3 | Raised the offline mark opacity to a compliant amber contrast. | all-route Axe smoke including `/offline` |
| F-1-4 | History entries save `scrollY`; popstate restores it while new navigations start at the top. | `back navigation restores the prior scroll position` |
| F-1-5 | SPA metadata updates every route, production emits route-specific static documents, and 404 has canonical/OG/Twitter/apple-touch metadata. | `every app route updates its share metadata`; inspected `dist/{demo,privacy,terms,offline}/index.html` and `dist/404.html` |
| F-1-6 | Added the `typed-cloze` claim and a real save → blank → typed-answer flow; rewrote README plainly. | `@claim:typed-cloze` |
| F-1-7 | Added the quantitative `demo-sample-count` claim. | `@claim:demo-sample-count` |
| F-1-8 | Added the `due-queue` claim and observable due-question test. | `@claim:due-queue` |
| F-1-9 | Replaced the learning-outcome promise with “Review the words you confused.” | copy audit; `@claim:confusion-pairs` |
| F-1-10 | Removed the exhaustive negative feature claim; retained only concrete learner-content guidance. | copy audit and landing inspection |
| F-1-11 | Removed the unproved free practice/export sentence; the tested 50-word limit remains. | `@claim:free-limit` |
| F-1-12 | Added the visible secure-checkout label and `checkout-link` claim; refund responsibility remains in Terms. | `@claim:checkout-link`; `npm run test:live` |
| F-1-13 | Added the `unicode-normalisation` claim and browser test for composed/decomposed accented input. | `@claim:unicode-normalisation` |
| F-1-14 | Rewrote the privacy wording precisely and added a multi-route resource audit. | `@claim:no-tracking-resources` |
| F-1-15 | Added a storage/destination claim test for returned license tokens. | `@claim:license-token-privacy` |
| F-1-16 | Added a browser storage-clear test covering real data, demo data, and license storage. | `@claim:clear-site-data` |
| F-1-17 | Replaced public JSON jargon with Download backup/Restore backup and moved implementation names to README developer notes. | copy audit; `@claim:backup-roundtrip` |
| F-1-18 | Renamed the ambiguous headings to “Review words you confuse” and “Remove the 50-word limit.” | copy audit |
| F-1-19 | Standardised the collection name as “word list” and verb spelling as “practise.” | copy audit |
| F-1-20 | Made the checkout and Param Factory destinations visibly external. | landing/footer inspection; `@claim:checkout-link` |

The static production routes are checked locally at `/demo`, `/privacy`,
`/terms`, `/offline`, and `/404.html`. Deployment and cold live URL evidence is
recorded in the handoff after the deployment step.
