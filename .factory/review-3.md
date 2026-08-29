# Adversarial first-read review 3 — Context Cloze

**Verdict: FAIL.** Reviewed 2026-08-29 against commit `4c576aab35ad4b9898db9e89c9db036fc0ac90db` and the live site at <https://context-cloze-vocab.sociobot.in>. The core job works, but seven copy/claim-inventory findings remain. A PASS requires zero findings.

## Cold first read

In fresh browser contexts at 390 × 844 and 1440 × 900, before scrolling:

- It lets independent language learners practise recalling their own words in the sentences they chose.
- It is for learners who know a word but cannot retrieve it while writing or speaking.
- Click **Try it with sample data** first.

The exact first-screen copy was **“Recall words inside sentences”**, **“For independent learners who recognise words but cannot retrieve them while writing or speaking.”**, and **“Try it with sample data”**. The adjacent result copy was **“Opens eight sample words. Your word list stays untouched.”** This gate passes at both sizes; there were no page or console errors.

## Findings

### Major

#### F-3-1 — Privacy page promises that demo never reads real data without a matching claim

- **Location/quote:** `/privacy`, **“Sample data uses separate browser storage and never reads your real word list.”**
- **Why this fails:** `demo-isolation` promises only **“Demo changes never enter the learner's real vocabulary.”** Its test starts in demo, adds a demo word, then leaves to an empty real workspace. It does not first create a real word and prove that the demo neither displays nor reads it. The stronger live privacy statement has no claim entry and no isolated automated proof.
- **Evidence:** manual live testing did create real `keepsake`, entered `?demo=1`, added demo-only `temporary`, and observed `keepsake` only in `context-cloze-real` and `temporary` only in `context-cloze-demo`; therefore the implementation is currently correct. This is a missing proof for a visitor-reliable privacy promise, not an observed data leak.
- **Concrete fix:** extend `demo-isolation` (or add `demo-no-real-read`) to create a named real word, enter the demo, assert that word is absent from the demo DOM and demo IndexedDB, add a named demo word, and assert the real database remains unchanged. List the full no-read/no-write promise in `.factory/claims.json`.

### Minor

#### F-3-2 — The landing page retains a mood label that does not name its section

- **Location/quote:** landing `#how` eyebrow, **“A small daily loop”**.
- **Why this fails:** it neither identifies the section nor tells a visitor what to do. The useful heading immediately below is **“How sentence practice works”**; the eyebrow is surplus mood copy.
- **Concrete fix:** remove the eyebrow, or replace it with **“Practice steps”**.

#### F-3-3 — The landing page retains an ambiguous metaphor above confusion pairs

- **Location/quote:** demo and populated landing workspace eyebrow, **“Close calls”**.
- **Why this fails:** it requires the visitor to infer that this means wrong answers. This is a residual version of the terminology concern in F-1-18; the visible `h3` was correctly changed to **“Confusion pairs”**, but the ambiguous label remains.
- **Concrete fix:** remove the eyebrow, or use **“Wrong answers”**.

#### F-3-4 — The hero caption begins with a slogan rather than an instruction

- **Location/quote:** landing hero caption, **“Bring the sentence.”**
- **Why this fails:** it carries no usable first-read instruction on its own. “Bring” is metaphorical and leaves a visitor to infer where and how to add a sentence.
- **Concrete fix:** replace both caption fragments with **“Add a word and a sentence. Context Cloze hides the word.”** The existing `typed-cloze` claim covers the second sentence.

#### F-3-5 — Original-art provenance is an unlisted public claim

- **Location/quote:** footer, **“Version 1.0.0 · Original generated scene”**; README developer notes, **“The generated environmental artwork is original to this product.”**
- **Why this fails:** originality and generation are factual provenance claims, but neither has an entry or sandbox test in `claims.json`. The provenance is documented appropriately in `.factory/design.md`; repeating it as visitor copy adds an untestable claim.
- **Concrete fix:** remove **“Original generated scene”** from the footer and the README sentence. Keep the prompt and provenance record in `.factory/design.md`.

#### F-3-6 — Merchant/refund statements are unlisted claims and include legal jargon

- **Location/quote:** landing paid panel, **“Sociobot/Dodo is the merchant of record. See terms for refunds.”** Terms, **“Sociobot/Dodo is the merchant of record and handles refunds.”** and **“A refunded or disputed purchase may revoke its license.”**
- **Why this fails:** `checkout-link` proves only that the purchase link points to Sociobot's checkout endpoint. It does not prove merchant status, refund handling, or revocation. “Merchant of record” also does not explain an action to a first-time buyer.
- **Concrete fix:** either add separately testable contractual evidence for these statements, or replace the landing and terms wording with **“For license or refund questions, email support@sociobot.in.”** Link the address. That names the next action without making an unproved billing claim.

#### F-3-7 — The scope eyebrow is a slogan, not a section name

- **Location/quote:** landing privacy/scope section eyebrow, **“A quiet tool, not a course”**.
- **Why this fails:** it is a mood comparison, not an identifiable section. The section then contains content ownership and local-storage information; the eyebrow does not prepare a reader for either.
- **Concrete fix:** remove it, or use **“Your content and storage”**.

## Copy audit

Counts treat URLs, prices, hyphenated words, and product names as one word. No sentence exceeds 22 words. The flagged fragments below are visitor-facing headings or slogans; labels and user-entered examples are not counted as sentences.

### Landing page

| Sentence or fragment | Words | Result |
| --- | ---: | --- |
| Paste your own words and sentences, then practise retrieving each word in context. | 13 | `typed-cloze` |
| Your word list stays on your device. | 7 | `local-storage` |
| Your words · your sentences | 4 | Clear descriptor |
| Recall words inside sentences | 4 | Clear h1 |
| For independent learners who recognise words but cannot retrieve them while writing or speaking. | 14 | Clear audience |
| Opens eight sample words. | 4 | `demo-sample-count` |
| Your word list stays untouched. | 5 | `demo-isolation` |
| Stored on this device | 4 | `local-storage` |
| Works offline after your first visit | 6 | `offline-reload` |
| Free for 50 words | 4 | `free-limit` |
| A blank notebook waits under a lamp beside a rainy night window. | 12 | Accurate alt text |
| Bring the sentence. | 3 | F-3-4 |
| Context Cloze supplies the blank. | 5 | `typed-cloze`; rewrite with caption |
| Add a word and a sentence that uses it. | 9 | Useful empty state |
| You can then start a typed review. | 7 | `typed-cloze` |
| Saved words will appear here. | 5 | Useful empty state |
| A tab works instead of the \| mark. | 8 | Useful input help |
| Backups include your sentences, schedule, and answer history. | 8 | `backup-roundtrip` |
| Backup files use JSON format. | 5 | Format note |
| A small daily loop | 4 | F-3-2 |
| Paste a word and a sentence you trust. | 8 | Useful instruction |
| Each saved word becomes a blank. | 7 | `typed-cloze` |
| Due words return as questions. | 5 | `due-queue` |
| Capitalisation does not affect marking. | 5 | `case-insensitive-marking` |
| Wrong guesses become confusion pairs. | 5 | `confusion-pairs` |
| Review the words you confused. | 6 | Useful instruction |
| A quiet tool, not a course | 6 | F-3-7 |
| Only add text you may store. | 6 | Useful scope instruction |
| Your word list remains in this browser unless you download a backup. | 12 | `local-storage` |
| Pay $12 once for unlimited words and the full confusion-pair history. | 11 | `free-limit`, `paid-license` |
| The free list holds 50 words. | 6 | `free-limit` |
| Sociobot/Dodo is the merchant of record. | 7 | F-3-6; jargon |
| See terms for refunds. | 4 | F-3-6 |
| Type the missing word in sentences you chose. | 8 | Plain footer one-liner |
| Version 1.0.0 · Original generated scene | 5 | F-3-5 |

### README

| Sentence | Words | Result |
| --- | ---: | --- |
| Practise your word list with typed sentence blanks. | 8 | `typed-cloze` |
| Context Cloze is for independent language learners who recognise a word but cannot retrieve it while writing or speaking. | 19 | Clear audience |
| Add a word and its sentence, then type the missing word when it is due. | 15 | `typed-cloze`, `due-queue` |
| Wrong guesses become confusion pairs. | 5 | `confusion-pairs` |
| Turns each saved word into a blank that you answer by typing. | 12 | `typed-cloze` |
| Keeps your word list in this browser during practice. | 9 | `local-storage` |
| Accepts right-to-left words and accented answers typed in either common form. | 11 | Unicode claims |
| Updates each word’s next due date after an answer. | 9 | `typed-scheduling` |
| Counts repeated wrong guesses beside the intended word. | 8 | `confusion-pairs` |
| Downloads and restores backups with word, schedule, and answer history. | 10 | `backup-roundtrip` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Keeps the sample word list separate from your real word list. | 11 | `demo-isolation` |
| The free list holds 50 words. | 6 | `free-limit` |
| A $12 one-time personal license removes that limit and shows the full confusion history. | 14 | `free-limit`, `paid-license` |
| The purchase link opens Sociobot’s secure checkout. | 7 | `checkout-link` |
| A license token stays in browser storage and is sent only to Sociobot to check the license. | 17 | `license-token-privacy` |
| Requires Node.js 20 or newer. | 6 | Run instruction |
| Open http://localhost:5173. | 1 | Run instruction |
| Use http://localhost:5173/?demo=1 for the isolated sample word list. | 4 | Run instruction |
| npm test runs model tests, claim tests, accessibility checks, and the 390 px layout check in Chromium. | 17 | Run instruction |
| npm run build writes the static deploy to dist/, with dist/index.html at its root. | 16 | Run instruction |
| Inspect it with npm run preview. | 6 | Run instruction |
| Publish the contents of dist/ as a static site. | 9 | Deploy instruction |
| Keep staticwebapp.config.json at the site root so real routes, headers, caching, and the designed 404 response remain active. | 19 | Deploy instruction |
| The Param Factory manages the production deployment and DNS. | 8 | Deployment scope |
| This app includes no advertising, behavioural analytics, third-party fonts, or third-party scripts. | 12 | `no-tracking-resources` |
| Use your browser’s site-data controls to remove stored app data. | 10 | `clear-site-data` |
| Read the in-app /privacy and /terms pages for the full policy. | 10 | Useful link instruction |
| Real and sample word lists use separate IndexedDB databases. | 9 | Developer note; supports F-3-1 proof gap |
| Backups use JSON format. | 4 | Developer note |
| The generated environmental artwork is original to this product. | 9 | F-3-5 |
| MIT licensed. | 2 | License statement |

## Demo, claims, sandbox, and history

- The first click reaches `/?demo=1`. After the brief local IndexedDB load, its first 390 px viewport shows a real sample sentence with a blank, **Your answer**, and **Check answer**. The persistent banner, **Reset demo**, and **Start for real** are present.
- Manual live storage check confirmed real `keepsake` remains isolated from demo-only `temporary`; the demo made same-origin requests only. Reset and exit controls are present. F-3-1 is the automated-proof gap described above.
- Every one of the 19 exact commands in `.factory/claims.json` passed from a fresh clone at this commit. `npm test` recorded `{"status":"passed","failedTests":[]}`; `npm run build` produced `dist/` (11.26 KB gzip JavaScript); and `npm run test:live` passed home 200, designed 404, Dodo checkout redirect, and invalid-license rejection.
- The request log for fresh landing/demo/privacy/terms use contained only `https://context-cloze-vocab.sociobot.in`; no console errors were observed.

All prior findings were checked on the live deployment and in source:

| Earlier finding | Current state |
| --- | --- |
| F-1-1 | Fixed: demo opens on a seeded typed question. |
| F-1-2 | Fixed: Restore backup label has a visible focus treatment. |
| F-1-3 | Fixed: offline contrast is covered by the all-route Axe suite. |
| F-1-4 | Fixed: source stores/restores scroll on `popstate`. |
| F-1-5 | Fixed: route titles and social metadata update per route. |
| F-1-6 through F-1-16 | Fixed: listed claim entries/tests exist and pass. F-3-1 is a newly identified stronger no-read privacy sentence. |
| F-1-17 | Fixed: public backup controls use Download/Restore backup. |
| F-1-18 | Fixed as written: the section heading is now “Confusion pairs”; F-3-3 covers the remaining eyebrow. |
| F-1-19 | Fixed: “word list” and “practise” are consistent. |
| F-1-20 | Fixed: checkout and factory links visibly identify their destination. |
| F-2-1 | Fixed: `clear-site-data` now checks both databases and the license before reload. |

## Structure and missed leverage

All checked routes (`/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, `/offline`, and an unknown route) returned the expected status and had one `h1`, one `main`, an appropriate title/description/canonical, working visible links, and the distinct night-archive visual system. The 404 is designed and returns HTTP 404. Header/footer links, Privacy/Terms, deep links, route focus, and Back restoration are present. The brief does not imply a necessary AI feature; offline practice and backup import/export are already supplied.

## What would make this perfect

Add the focused demo no-read/no-write claim test, then remove or rewrite the six residual slogan, jargon, and unlisted-provenance/billing statements above. Rerun the claim inventory and this cold review. No functional feature gap was identified.
