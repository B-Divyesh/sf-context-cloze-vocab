# Adversarial first-read review 2 — Context Cloze

**Verdict: FAIL.** Reviewed on 2026-08-28 against live
<https://context-cloze-vocab.sociobot.in> and clean commit
`9ae45c77f830d019e93e13fd5aca2c9ae9a1e52b`. A PASS requires zero findings;
one blocking claim-verification finding remains.

## Cold first read

I opened a new browser context with no site data at 390 × 844 and 1440 × 900,
without scrolling.

- What it does: it lets a learner put their own word into a sentence and later
  type the missing word.
- For whom: independent language learners who recognise words but cannot
  retrieve them when writing or speaking.
- First click: **Try it with sample data**.

The phone and desktop first screens answer all three. The exact text is
**“Recall words inside sentences”**, **“For independent learners who recognise
words but cannot retrieve them while writing or speaking.”**, and **“Try it
with sample data”**. The adjacent result is clear: **“Opens eight sample
words. Your word list stays untouched.”** This gate passes.

## Finding

### Blocking

#### F-2-1 — The storage-deletion promise is not actually proved by its claim test

- **Location/quote:** privacy page and README: **“Use your browser’s
  site-data controls to remove stored app data.”** Claims entry
  `clear-site-data`: **“Browser site-data controls remove stored app data.”**
  Test: `tests/claims.spec.ts`, `@claim:clear-site-data`.
- **Evidence:** the test creates a real `keepsake` word, opens the demo, and
  calls `Storage.clearDataForOrigin`. It then reloads `/demo`; that route
  immediately seeds a fresh `context-cloze-demo` database. Its only record
  assertion is that the database name equals `context-cloze-demo`, plus a
  check that the license key is null. It never reads the previously populated
  real store, checks for `keepsake`, or verifies that the prior demo records
  disappeared. A regression that left real records behind would pass.
- **Why this blocks:** the claims contract requires an observable clean-sandbox
  test of the promised outcome. This is a data-deletion/privacy promise, and
  the required sandbox specifically calls for creating real and demo records
  then asserting no app records remain. The listed test passes, but that part
  of the visitor-reliable claim remains untested.
- **Concrete fix:** after `Storage.clearDataForOrigin`, assert with
  `indexedDB.databases()` that neither app database exists before any reload.
  Then navigate to `/` and assert **“0 words”** and that `keepsake` is absent.
  If the demo is revisited, assert its eight sample records are newly seeded,
  not preserved records. Keep the existing license-key assertion.

## Copy audit

Counts use words rather than punctuation; URLs and product names count as one.
No landing or README sentence exceeds 22 words. No banned marketing adjective,
unexplained heading, inconsistent collection term, or non-result-naming action
was found. `JSON` appears only in the explanatory backup-format note and
developer notes.

### Landing page sentences

| Sentence | Words | Check |
| --- | ---: | --- |
| Paste your own words and sentences, then practise retrieving each word in context. | 13 | `typed-cloze` |
| Your word list stays on your device. | 7 | `local-storage` |
| For independent learners who recognise words but cannot retrieve them while writing or speaking. | 14 | Plain audience statement |
| Opens eight sample words. | 4 | `demo-sample-count` |
| Your word list stays untouched. | 5 | `demo-isolation` |
| Stored on this device | 4 | `local-storage` |
| Works offline after your first visit | 6 | `offline-reload` |
| Free for 50 words | 4 | `free-limit` |
| Bring the sentence. | 3 | Plain instruction |
| Context Cloze supplies the blank. | 5 | `typed-cloze` |
| Add a word and a sentence that uses it. | 9 | Plain instruction |
| You can then start a typed review. | 7 | `typed-cloze` |
| Saved words will appear here. | 5 | Empty-state instruction |
| A tab works instead of the \| mark. | 7 | Plain input help |
| Backups include your sentences, schedule, and answer history. | 8 | `backup-roundtrip` |
| Backup files use JSON format. | 5 | Explanatory format note |
| Paste a word and a sentence you trust. | 8 | Plain instruction |
| Each saved word becomes a blank. | 6 | `typed-cloze` |
| Due words return as questions. | 5 | `due-queue` |
| Capitalisation does not affect marking. | 5 | `case-insensitive-marking` |
| Wrong guesses become confusion pairs. | 5 | `confusion-pairs` |
| Review the words you confused. | 5 | Plain instruction |
| Only add text you may store. | 6 | Plain instruction |
| Your word list remains in this browser unless you download a backup. | 12 | `local-storage` |
| Pay $12 once for unlimited words and the full confusion-pair history. | 11 | `free-limit`, `paid-license` |
| The free list holds 50 words. | 6 | `free-limit` |
| Sociobot/Dodo is the merchant of record. | 7 | Terms/payment statement |
| See terms for refunds. | 4 | Links to policy |
| Type the missing word in sentences you chose. | 8 | Product one-liner |

The sentence-like headings are also clear out of context: **Recall words
inside sentences**, **How sentence practice works**, **You choose every
sentence**, and **Remove the 50-word limit**. Actions name outcomes:
**Try it with sample data**, **Add your words**, **Save word**, **Check
answer**, **Download backup**, **Restore backup**, **Reset demo**, **Start for
real**, and **Buy for $12 once — opens secure checkout**. No copy finding is
raised.

### README sentences

| Sentence | Words | Check |
| --- | ---: | --- |
| Practise your word list with typed sentence blanks. | 8 | `typed-cloze` |
| Context Cloze is for independent language learners who recognise a word but cannot retrieve it while writing or speaking. | 19 | Plain audience statement |
| Add a word and its sentence, then type the missing word when it is due. | 15 | `typed-cloze`, `due-queue` |
| Wrong guesses become confusion pairs. | 5 | `confusion-pairs` |
| Turns each saved word into a blank that you answer by typing. | 12 | `typed-cloze` |
| Keeps your word list in this browser during practice. | 9 | `local-storage` |
| Accepts right-to-left words and accented answers typed in either common form. | 11 | `unicode-rtl`, `unicode-normalisation` |
| Updates each word’s next due date after an answer. | 9 | `typed-scheduling` |
| Counts repeated wrong guesses beside the intended word. | 8 | `confusion-pairs` |
| Downloads and restores backups with word, schedule, and answer history. | 10 | `backup-roundtrip` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Keeps the sample word list separate from your real word list. | 11 | `demo-isolation` |
| The free list holds 50 words. | 6 | `free-limit` |
| A $12 one-time personal license removes that limit and shows the full confusion history. | 14 | `free-limit`, `paid-license` |
| The purchase link opens Sociobot’s secure checkout. | 7 | `checkout-link` |
| A license token stays in browser storage and is sent only to Sociobot to check the license. | 17 | `license-token-privacy` |
| Requires Node.js 20 or newer. | 6 | Operating instruction |
| Open http://localhost:5173. | 4 | Operating instruction |
| Use http://localhost:5173/demo for the isolated sample word list. | 11 | Operating instruction |
| npm test runs model tests, claim tests, accessibility checks, and the 390 px layout check in Chromium. | 17 | Operating instruction |
| npm run build writes the static deploy to dist/, with dist/index.html at its root. | 16 | Operating instruction |
| Inspect it with npm run preview. | 6 | Operating instruction |
| This app includes no advertising, behavioural analytics, third-party fonts, or third-party scripts. | 12 | `no-tracking-resources` |
| Use your browser’s site-data controls to remove stored app data. | 10 | F-2-1 |
| Read the in-app /privacy and /terms pages for the full policy. | 11 | Plain instruction |
| Real and sample word lists use separate IndexedDB databases. | 9 | Developer note; `demo-isolation` |
| Backups use JSON format. | 4 | Developer note |
| The generated environmental artwork is original to this product. | 9 | Provenance statement |
| MIT licensed. | 2 | License statement |

There are no unlisted claim-like landing or README statements. F-2-1 is a
listed claim with an incomplete test, not a missing claim entry.

## Demo, sandbox, privacy, and claims

The live **Try it with sample data** link reached `/demo` in one click. In a
fresh 390 px context the route presented the seeded exercise — **“The quiet
melody remained _____ after the concert ended.”**, an answer field, and
**Check answer** — after initial loading. The persistent banner says
**“Demo — sample data, nothing is saved to your word list”** and exposes
**Reset demo** and **Start for real**.

I saved a real `keepsake` word, added a demo-only `temporary` word, reset the
demo, then chose Start for real. `keepsake` remained, `temporary` was absent,
and no cross-origin request occurred. After service-worker control, setting the
fresh demo context offline and reloading retained the eight sample words. This
confirms the live isolation and offline behaviour; F-2-1 concerns only the
insufficient automated proof for browser data clearing.

From `/tmp/context-cloze-review2.ZE4OQT`, I ran `npm ci` and every exact
command declared by `.factory/claims.json`. All passed:

| Claim IDs with passing listed tests |
| --- |
| `demo-sample-count`, `demo-isolation`, `typed-cloze`, `typed-scheduling`, `due-queue`, `case-insensitive-marking`, `full-session` |
| `unicode-rtl`, `unicode-normalisation`, `backup-roundtrip`, `confusion-pairs`, `no-tracking-resources`, `local-storage` |
| `checkout-link`, `license-token-privacy`, `clear-site-data`, `offline-reload`, `free-limit`, `paid-license` |

`clear-site-data` is included in that passing list, but is the incomplete
assertion described in F-2-1. A passing exit code does not close an untested
part of the stated claim.

## History check

I read `review-1.md`, `polish-1.md`, previous verification reports, and the
prior handoff, then checked each repair in the live build and source. No
review-1 finding recurs.

| Earlier finding | Confirmed current state |
| --- | --- |
| F-1-1 | Demo opens on a seeded blank, input, and Check answer action. |
| F-1-2 | Restore backup has `:focus-within` amber outline and regression test. |
| F-1-3 | `/offline` uses the raised-contrast mark; all-route Axe test includes it. |
| F-1-4 | `history.state.scrollY` is saved/restored on `popstate`; regression test passes. |
| F-1-5 | Static routes and 404 have route-specific title, canonical, OG, Twitter, and apple-touch metadata. |
| F-1-6–F-1-8 | `typed-cloze`, `demo-sample-count`, and `due-queue` claims/tests are present. |
| F-1-9–F-1-12 | Unproved outcome/negative/free/refund wording was removed or narrowed; checkout is listed. |
| F-1-13–F-1-16 | Unicode, tracking, license-token, and site-data claims have entries; the F-1-16 successor test remains incomplete as F-2-1. |
| F-1-17–F-1-20 | Backup wording, headings, terminology/spelling, and external-link labels are repaired. |

## Structure and quality checks

- Live `/`, `/demo`, `/privacy`, `/terms`, and `/offline` return 200; an
  unknown URL returns the designed 404 with HTTP 404. `robots.txt`, sitemap,
  favicon, manifest, canonical, OG/Twitter image, and apple-touch icon load.
- Every reviewed route has one h1, `<main>`, route-specific title and meta
  description. Route changes focus the new h1; the source has a polite route
  announcer and scroll restoration. Privacy and Terms appear in the consistent
  footer/header structure. The checkout returned 303 to Dodo and then 200.
- Crawled product links, mail links, the secure checkout, and the Param Factory
  external link; no dead product link was found.
- `npm test` passed (6 Vitest and 32 Playwright tests, including Axe and
  390 px layout checks). `npm run build` passed and produced `dist/`; initial
  JS is 11.19 KB gzip. Deployed JS/CSS SHA-256 values match that build.
- Normal fresh live routes logged no console/page errors. The visible
  night-archive scene, clipped paper surfaces, amber lamp palette, and
  restrained motion follow the documented original visual thesis rather than a
  generic SaaS template.
- The brief does not imply a necessary AI feature. Backup import/export and
  offline local storage are present; no decorative AI integration or embedded
  provider key was found.

## What would make this perfect

Make `@claim:clear-site-data` prove deletion of the existing real and demo
records, then rerun the full claim inventory and this cold review. With that
evidence, no visitor-facing clarity, demo, routing, or visual issue remains.
