# Adversarial first-read review 5 — Context Cloze

**Verdict: FAIL.** Reviewed 2026-08-29 on live production,
`https://context-cloze-vocab.sociobot.in`, and from a fresh clone at commit
`66c2db69ca894494e92ce33e445ae6cbffb0c460`. One blocking core-workflow gap
and one minor copy/claim issue remain. PASS requires zero findings.

## Cold first read

I opened fresh 390 × 844 and 1440 × 900 browser contexts without scrolling.

| Question | Answer | Visible evidence |
| --- | --- | --- |
| What does it do? | It practises recalling the learner's own words in sentences. | “Recall words inside sentences” |
| For whom? | Independent language learners who know words but cannot retrieve them in use. | “For independent learners who recognise words but cannot retrieve them while writing or speaking.” |
| What first? | Try the seeded sample. | “Try it with sample data” and “Opens eight sample words. Your word list stays untouched.” |

The first-read gate passes. At 390 px the sample action ends at y=513, so it
is visible without scrolling. The product has a distinct, on-brief night
archive identity rather than a generic SaaS template: dark archive palette,
clipped paper surfaces, serif sentence setting, and original study-room art.

## Findings

### Blocking

#### F-5-1 — A pasted word list cannot start the stated workflow

- **Location/quote:** `.factory/brief.json` requires a product that
  **“accepts a pasted word list and user-supplied example sentences.”** The
  live bulk input is only **“One per line: word | sentence”**. Pasting bare
  lines `elusive`, `plausible`, and `meticulous` produces **“Line 1 needs a
  word, a |, and a sentence.”** for each line.
- **Why a visitor is blocked:** someone who already has a vocabulary list
  cannot bring it in before writing or choosing sentences. They must retype
  every word into a coupled word-and-sentence record. This misses the brief's
  smallest useful workflow.
- **Concrete fix:** add **Paste a word list** for one word per line. Create
  those local records, then guide the learner through an ordered **Add a
  sentence** step. Keep paired bulk entry for people who already have example
  sentences. Add a `@claim:` test from `/?demo=1` that pastes three bare words,
  proves they use only demo storage, and verifies the sentence-entry next step.

### Minor

#### F-5-2 — The landing page exposes unexplained file-format jargon and an unlisted claim

- **Location/quote:** data panel: **“Backup files use JSON format.”**
- **Why a visitor is lost or misled:** “JSON” does not tell a language learner
  what they can do with a backup. It is also a visitor-facing format claim with
  no matching `.factory/claims.json` entry; `backup-roundtrip` promises data
  preservation, not a JSON format.
- **Concrete fix:** remove the sentence from the public panel; **Download
  backup** and **Restore backup** already name the result. If format must stay
  public, add a `backup-json-format` claim with an observable MIME/JSON-parse
  download test and explain its practical use. The README developer note may
  retain technical format information.

## Copy audit

Counts treat prices, email addresses, hyphenated terms, URLs, and commands as
one word. URLs, code blocks, headings, form labels, navigation, and buttons
are not prose sentences; they were separately checked. No prose sentence is
over 22 words. F-5-2 is the only jargon, unlisted-claim, or wording flag.

### Landing sentences

| Words | Sentence |
| ---: | --- |
| 14 | For independent learners who recognise words but cannot retrieve them while writing or speaking. |
| 4 | Opens eight sample words. |
| 5 | Your word list stays untouched. |
| 6 | Add a word and a sentence. |
| 5 | Context Cloze hides the word. |
| 9 | Add a word and a sentence that uses it. |
| 7 | You can then start a typed review. |
| 7 | A tab works instead of the \| mark. |
| 5 | Saved words will appear here. |
| 8 | Backups include your sentences, schedule, and answer history. |
| 5 | Backup files use JSON format. |
| 8 | Paste a word and a sentence you trust. |
| 6 | Each saved word becomes a blank. |
| 5 | Due words return as questions. |
| 5 | Capitalisation does not affect marking. |
| 4 | Wrong guesses become confusion pairs. |
| 6 | Review the words you confused. |
| 6 | Only add text you may store. |
| 12 | Your word list remains in this browser unless you download a backup. |
| 11 | Pay $12 once for unlimited words and the full confusion-pair history. |
| 6 | The free list holds 50 words. |
| 7 | For license or refund questions, email support@sociobot.in. |
| 4 | Read the license terms. |
| 8 | Type the missing word in sentences you chose. |

The headings are contextual (**How sentence practice works**, **Back up or
restore your word list**, **Remove the 50-word limit**). The first eyebrow,
**Your words · your sentences**, is a clear descriptor. Actions name results:
**Try it with sample data**, **Add your words**, **Save word**, **Check
answer**, **Download backup**, **Restore backup**, **Reset demo**, and **Start
for real**.

### README sentences

| Words | Sentence |
| ---: | --- |
| 8 | Practise your word list with typed sentence blanks. |
| 19 | Context Cloze is for independent language learners who recognise a word but cannot retrieve it while writing or speaking. |
| 15 | Add a word and its sentence, then type the missing word when it is due. |
| 5 | Wrong guesses become confusion pairs. |
| 12 | Turns each saved word into a blank that you answer by typing. |
| 9 | Keeps your word list in this browser during practice. |
| 11 | Accepts right-to-left words and accented answers typed in either common form. |
| 9 | Updates each word’s next due date after an answer. |
| 8 | Counts repeated wrong guesses beside the intended word. |
| 10 | Downloads and restores backups with word, schedule, and answer history. |
| 6 | Works offline after the first visit. |
| 14 | Keeps the sample word list separate and never reads or changes your real word list. |
| 6 | The free list holds 50 words. |
| 14 | A $12 one-time personal license removes that limit and shows the full confusion history. |
| 7 | The purchase link opens Sociobot’s secure checkout. |
| 17 | A license token stays in browser storage and is sent only to Sociobot to check the license. |
| 5 | Requires Node.js 20 or newer. |
| 2 | Open `http://localhost:5173`. |
| 7 | Use `http://localhost:5173/?demo=1` for the isolated sample word list. |
| 17 | `npm test` runs model tests, claim tests, accessibility checks, and the 390 px layout check in Chromium. |
| 12 | `npm run build` writes the static deploy to `dist/`, with `dist/index.html` at its root. |
| 6 | Inspect it with `npm run preview`. |
| 12 | After deployment, run `npm run test:live` for routing and billing checks. |
| 18 | Run `npm run test:live:browser` for the cold demo, offline, Axe, focus, privacy, mobile, and storage-isolation checks. |
| 9 | Publish the contents of `dist/` as a static site. |
| 17 | Keep `staticwebapp.config.json` at the site root so real routes, headers, caching, and the designed 404 response remain active. |
| 9 | The Param Factory manages the production deployment and DNS. |
| 12 | This app includes no advertising, behavioural analytics, third-party fonts, or third-party scripts. |
| 10 | Use your browser’s site-data controls to remove stored app data. |
| 13 | Read the in-app `/privacy` and `/terms` pages for the full policy. |
| 9 | Real and sample word lists use separate IndexedDB databases. |
| 4 | Backups use JSON format. |
| 2 | MIT licensed. |

The technical operational/developer-note lines are appropriately scoped. All
product, privacy, billing, Unicode, demo, and offline README claims have a
declared test except the JSON-format wording in F-5-2.

## Demo, claims, sandbox, and structure

- **Demo:** one click opens `/?demo=1` directly to a realistic missing-word
  sentence, meaning, answer input, and **Check answer** by y=587 on 390 px.
  The persistent banner says **“Demo — sample data, nothing is saved to your
  word list”**; Reset and Start for real both worked.
- **Isolation:** production Playwright saved real `keepsake`, entered demo,
  added/reset demo `temporary`, then exited. Real storage remained
  `["keepsake"]`; demo storage was `[]` after exit. No real word appeared in
  demo DOM mutations.
- **Privacy/offline:** the production request log had no cross-origin requests
  during the tested product flow. After service-worker control, offline reload
  retained the eight demo words.
- **Claims:** all 22 exact commands in `.factory/claims.json` completed from a
  fresh clone. `npm test` passed (10 Vitest, 38 Playwright); `npm run build`
  passed and produced `dist/`.
- **Live verification:** `npm run test:live` passed (200 home, 404 unknown
  route, 303 Dodo checkout, inactive invalid license). `npm run
  test:live:browser` passed with zero console errors, zero serious/critical
  Axe issues on all six routes, zero external requests, working Back
  focus/scroll, 0 px overflow at 200% text, and reduced motion.
- **Routes/links:** `/`, `/demo`, `/privacy`, `/terms`, and `/offline` return
  200; an unknown route is a designed 404. Every checked route has its
  expected title, h1, main, description, canonical, OG/Twitter metadata,
  favicon, header/footer, Privacy/Terms, and focus management. The internal
  route, robots, sitemap, checkout (303), and Param Factory (200) links crawl
  successfully.

Every finding in reviews 1–4 and every polish/handoff record was read. The
prior fixes for demo first screen, focus, contrast, history, metadata, cloze
claims, storage deletion, isolation, copy, checkout, bulk tab entry,
due-only sessions, and free-pair limit are confirmed live and in source; none
regressed.

The brief does not imply a required AI action: learner-supplied sentences are
the privacy-preserving core, and no decorative AI or embedded provider key is
present.

## What would make this perfect

Accept an existing one-word-per-line vocabulary list and guide sentence entry
after import. Remove the public JSON-format line or test and explain it. Rerun
the full claim inventory and cold-site review; only a zero-finding result is
PASS.
