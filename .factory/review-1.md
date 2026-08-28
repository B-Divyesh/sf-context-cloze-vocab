# Adversarial first-read review 1 — Context Cloze

**Verdict: FAIL.** Reviewed 2026-08-28 against commit
`1dbef8f10c84cea10aff356a149adee4b3b42dcd` and the live site at
<https://context-cloze-vocab.sociobot.in>. One blocking finding and additional
major and minor findings remain. A PASS requires zero findings.

## Cold first read

I opened the live home page without saved site data at 390 × 844 and 1440 ×
900. I recorded the first viewport before scrolling.

- What it does: it turns the learner's own words and sentences into typed
  fill-in-the-blank recall practice.
- For whom: independent language learners who recognise words but struggle to
  retrieve them while writing or speaking.
- What to click first: **Try it with sample data**.

The exact copy that answered those questions was **“Recall words inside
sentences”**, **“For independent learners who recognise words but cannot
retrieve them while writing or speaking.”**, and **“Try it with sample data”**.
The adjacent result copy, **“Opens eight sample words. Your vocabulary stays
untouched.”**, was also visible. The cold first-read gate passes on both sizes.

## Findings

### Blocking

#### F-1-1 — The demo needs a second action before it shows the product in use

- **Location/quote:** live `/demo`, first 390 × 844 viewport after clicking
  **Try it with sample data**: **“Practise sample words in context”** and
  **“Answer a due sentence, inspect the confusion pairs, or add a temporary
  word.”**
- **Evidence:** on the phone, the first viewport ends at the tops of the `8`,
  `5`, and `5` counters. It contains no sample word, sample sentence, blank,
  answer field, or practice action. On desktop, **Practise due words** is
  visible, but no actual sample sentence or word is shown. A visitor must
  scroll and click again before seeing the core product.
- **Why this fails:** the demo contract requires the first screen after the
  one-click entry to already show the product being used with realistic sample
  data. A second promotional lead repeats the explanation instead.
- **Concrete fix:** remove or collapse the demo lead and open `/demo` with the
  first seeded cloze sentence, answer field, and **Check answer** action in the
  first mobile viewport. Keep the demo banner visible and place counts and the
  word list below the active exercise.

### Major

#### F-1-2 — Import JSON has no visible keyboard focus

- **Location/quote:** landing workspace, **Import JSON**.
- **Evidence:** focusing `#import-file` makes the transparent input active.
  Its computed opacity is `0`; the visible label has `outline: none` and no
  box shadow. A screenshot showed no visible change around the control.
- **Why this fails:** keyboard users cannot see where focus moved, contrary to
  the required visible-focus baseline.
- **Concrete fix:** give `.file-label:focus-within` the same 3 px amber focus
  treatment as other controls, and add a keyboard regression test that tabs to
  Import JSON and asserts a visible focus style.

#### F-1-3 — The offline page fails the contrast baseline

- **Location/quote:** live `/offline`, decorative text **“C_____”**.
- **Evidence:** Axe reports `color-contrast` as serious: foreground `#635231`
  on `#0b1820`, ratio `2.38:1`, at 48 px. Large visible text requires `3:1`.
- **Why this fails:** the attached accessibility baseline requires compliant
  contrast on every route; the shipped accessibility test omits `/offline`.
- **Concrete fix:** increase the mark's opacity/use a lighter token until it is
  at least `3:1`, or render it as a non-text decorative shape. Add `/offline`
  to `tests/accessibility.spec.ts`.

#### F-1-4 — Back navigation discards the prior scroll position

- **Location:** SPA navigation from the home footer to `/privacy`, then browser
  Back.
- **Evidence:** the home page was at `scrollY=5233` before navigation. After
  Back it returned to `/` with the home `h1` focused but `scrollY=0`.
  `navigate()` always calls `window.scrollTo({ top: 0 })`, including popstate.
- **Why this fails:** the route contract requires back/forward to restore
  scroll and focus. Focus changes correctly, but the visitor loses their place.
- **Concrete fix:** save scroll by history entry and restore it on popstate;
  reserve scroll-to-top for new forward navigation. Add a back/forward test
  from a scrolled section.

#### F-1-5 — Route social metadata describes the home page

- **Location:** `/demo`, `/privacy`, `/terms`, and `/offline`.
- **Exact mismatch:** `/privacy` has document title **“Privacy — Context
  Cloze”**, but `og:title` and `twitter:title` remain **“Context Cloze —
  practise words in sentences”** and `og:url` remains the home URL. The other
  non-home routes have the same mismatch. The designed 404 has no canonical,
  Open Graph, Twitter, or apple-touch metadata.
- **Why this fails:** shared or indexed links misdescribe the destination, and
  the required metadata set is incomplete on the 404 route.
- **Concrete fix:** render route-specific metadata at the response layer, or
  update every OG/Twitter field with the route metadata and provide
  route-specific static entry documents for crawlers. Add canonical, OG,
  Twitter, and apple-touch metadata to `404.html`.

#### F-1-6 — The core typed-cloze claim is not listed

- **Location/quote:** README: **“Practice your own words by typing them into
  sentences.”** and **“Add a word with a sentence, then answer scheduled cloze
  prompts.”** Landing: **“The word becomes the blank.”**
- **Why this fails:** no `.factory/claims.json` entry states or tests that a
  saved word is removed from its sentence and can be answered as a cloze. The
  nearby scheduling test starts after the cloze already exists. “Cloze” is
  also unexplained jargon in the README.
- **Concrete fix:** add a `typed-cloze` claim and a tagged browser test that
  saves a word/sentence, verifies the displayed blank, types the word, and
  observes the result. Rewrite the second sentence as **“Add a word and its
  sentence, then type the missing word when it is due.”**

#### F-1-7 — The quantitative sample-size claim is not listed

- **Location/quote:** landing: **“Opens eight sample words.”**
- **Why this fails:** `full-session` happens to assert eight seeded words, but
  its declared claim is that a full session practises every saved word. The
  number eight is absent from every claim string.
- **Concrete fix:** add `demo-sample-count` with the quantitative claim and a
  fresh `/demo` assertion, or remove the number from the landing copy.

#### F-1-8 — The due-question behaviour is not listed

- **Location/quote:** landing: **“Due words return as open questions.”**
- **Why this fails:** `typed-scheduling` proves that an answer advances stored
  scheduling fields, not that due items return as questions.
- **Concrete fix:** add a `due-queue` claim whose tagged test advances time and
  observes a due word return as a blank, or rewrite this as non-promissory
  instructions that match an existing claim.

#### F-1-9 — A learning-outcome sentence is untestable and unlisted

- **Location/quote:** landing: **“Use them to sharpen word choice.”**
- **Why this fails:** “sharpen” promises an outcome that the sandbox does not
  define or measure.
- **Concrete fix:** replace it with **“Review the words you confused.”** The
  existing `confusion-pairs` claim can then cover the observable behaviour.

#### F-1-10 — The negative feature list is not in the claim inventory

- **Location/quote:** landing: **“Context Cloze has no dictionary, generated
  text, public decks, social feed, or streak.”**
- **Why this fails:** this is five visitor-reliable product-scope claims with no
  matching entry or test.
- **Concrete fix:** use the already clear heading **“You choose every
  sentence”** and remove the exhaustive negative claim, or add a single scoped
  `learner-supplied-content` claim with a test that verifies the app supplies
  no remote/generated sentence content.

#### F-1-11 — “Practice and exports remain free” is not proved

- **Location/quote:** landing: **“Practice, 50 words, and exports remain
  free.”** README: **“Practice and exports do not need a license.”**
- **Why this fails:** `free-limit` checks the displayed price/limit and rejects
  a 51-word import. `json-export` and `full-session` run in demo mode, where
  license restrictions are bypassed. No claim entry promises or test proves
  practice/export in an unlicensed real store.
- **Concrete fix:** add a `free-practice-export` entry and test both actions in
  a clean real store with no license, or narrow the sentence to the tested
  **“The free list holds 50 words.”**

#### F-1-12 — The checkout/refund statement is only partly checked

- **Location/quote:** landing: **“Checkout and refunds are handled by
  Sociobot/Dodo.”**
- **Why this fails:** `npm run test:live` confirms that checkout redirects to
  Dodo, but that check is outside `claims.json`, and no sandbox test can prove
  who handles refunds.
- **Concrete fix:** list and tag the observable checkout-redirect claim. Move
  refund responsibility to Terms with supporting policy evidence, or remove
  “refunds” from the product claim.

#### F-1-13 — Unicode normalisation is an unlisted README claim

- **Location/quote:** README: **“Matches typed answers with Unicode
  normalisation and case folding.”**
- **Why this fails:** `case-insensitive-marking` covers capitalisation and
  `unicode-rtl` covers an Arabic save/answer flow. A unit test covers composed
  versus decomposed text, but there is no matching claim entry or tagged
  sandbox test.
- **Concrete fix:** add `unicode-normalisation` and tag the existing model
  assertion plus an observable browser case, or rewrite the README to only
  state the two listed behaviours.

#### F-1-14 — The “no analytics/scripts” privacy claim is unlisted

- **Location/quote:** README: **“No analytics, third-party font, or runtime
  script is included.”** Privacy: **“This app includes no advertising,
  behavioural analytics, or third-party scripts.”**
- **Why this fails:** `local-storage` intercepts cross-origin requests during
  one demo practice flow. It does not inventory loaded scripts/fonts or rule
  out same-origin analytics across routes. The README wording also literally
  says no runtime script is included, while the PWA necessarily loads its own
  first-party JavaScript.
- **Concrete fix:** add a `no-tracking-resources` claim and a tagged test that
  audits all loaded resources and requests on home, demo, privacy, and terms,
  and rewrite the README as **“No analytics or third-party fonts or scripts are
  included.”** Otherwise remove the broad sentences.

#### F-1-15 — License-token storage and destination are unlisted

- **Location/quote:** README: **“A license token is kept in localStorage and
  sent only to `api.sociobot.in` for verification.”** Privacy makes the same
  promise in two sentences.
- **Why this fails:** `paid-license` intercepts a successful response but does
  not declare or assert the token's storage location or exclusive network
  destination.
- **Concrete fix:** add `license-token-privacy` with a tagged test that captures
  a token, checks the namespaced localStorage value, intercepts the request,
  and asserts no other destination receives it.

#### F-1-16 — Site-data deletion is an unlisted data-loss claim

- **Location/quote:** README: **“Clearing browser site data also clears the
  local vocabulary.”** Privacy: **“Delete browser site data to remove all local
  records.”**
- **Why this fails:** the claim is plausible but absent from the inventory and
  no clean-context test verifies deletion of both real and demo databases plus
  the stored license.
- **Concrete fix:** add a `clear-site-data` claim/test covering all local
  stores, or replace the sentence with browser-specific guidance that does not
  promise complete deletion.

### Minor

#### F-1-17 — User-facing copy uses unexplained implementation jargon

- **Location/quote:** **“Move or back up your vocabulary”**, **“Export JSON”**,
  and **“Import JSON”**. README also uses **“cloze”**, **“IndexedDB”**,
  **“Unicode normalisation and case folding”**, **“versioned JSON”**,
  **“service worker”**, the `context-cloze-demo` database name, **“Sociobot
  billing API”**, and **“localStorage”** without plain explanations.
- **Why this fails:** a language learner must understand a file format before
  choosing ordinary backup/restore actions, and the README's user-facing
  feature/privacy sections read like implementation notes. “Move” also does
  not name the result.
- **Concrete fix:** use **“Back up or restore your word list”**, **“Download
  backup”**, and **“Restore backup”**. Put **“JSON format”** in secondary help
  for technical users. In the README, lead with plain outcomes, for example
  **“Treats uppercase and lowercase answers as the same”** and **“Keeps real
  and sample word lists in separate browser storage”**; move implementation
  names to a developer-notes subsection.

#### F-1-18 — Two headings do not name their sections plainly

- **Location/quote:** **“Notice close calls”** and **“Keep a larger word
  archive.”**
- **Why this fails:** out of context, “close calls” sounds like avoided danger,
  and “larger archive” hides the paid result.
- **Concrete fix:** use **“Review words you confuse”** and **“Remove the
  50-word limit.”**

#### F-1-19 — The same concepts use inconsistent words and spelling

- **Location/quote:** the saved collection is called **“vocabulary”**, **“word
  list”**, **“material”**, **“copy”**, and **“word archive”**. The home title
  uses **“practise”** while the README lead uses **“Practice”** as the verb.
- **Why this fails:** first-time readers must infer that the collection terms
  refer to the same data, and the mixed British/American verb spelling looks
  accidental.
- **Concrete fix:** use **“word list”** for the collection everywhere and pick
  one locale; the existing UI points to British **“practise”**.

#### F-1-20 — External links do not identify themselves to the visitor

- **Location/quote:** **“Buy for $12 once”** leaves for the Dodo checkout, and
  **“Built by Param Factory”** leaves the product site. Neither visible label
  says it is external.
- **Why this fails:** `rel="external"` on the footer link is not a visible or
  announced warning. The site-structure contract requires external links to
  say so.
- **Concrete fix:** label them **“Buy for $12 once — opens secure checkout”**
  and **“Built by Param Factory (external site)”**, with accessible external
  link text/icon treatment.

## Copy audit

Counts treat hyphenated terms, paths, commands, and prices as one word. No
sentence exceeds 22 words, and no banned marketing adjective appears.

### Landing page sentences

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Meta description | Paste your own words and sentences, then practise retrieving each word in context. | 13 | Pass |
| Meta description | Your vocabulary stays on your device. | 6 | Covered by `local-storage` |
| OG/Twitter/footer | Type the missing word in sentences you chose. | 8 | Pass |
| First screen | For independent learners who recognise words but cannot retrieve them while writing or speaking. | 14 | Pass |
| First screen | Opens eight sample words. | 4 | F-1-7 |
| First screen | Your vocabulary stays untouched. | 4 | Covered by `demo-isolation` |
| Hero image alt | A blank notebook waits under a lamp beside a rainy night window. | 12 | Pass |
| Hero caption | Bring the sentence. | 3 | Pass |
| Hero caption | Context Cloze supplies the blank. | 5 | Pass |
| Empty state | Add a word and a sentence that uses it. | 9 | Pass |
| Empty state | You can then start a typed review. | 7 | Pass |
| Word list | Saved words will appear here. | 5 | Pass |
| Closed bulk-entry example | Clean water becomes scarce in summer. | 6 | Pass |
| Closed bulk-entry help | A tab works instead of the \| mark. | 8 | Pass |
| Data panel | Export includes your sentences, schedule, and answer history. | 8 | Covered by `json-export` |
| Step 1 | Paste a word and a sentence you trust. | 8 | Pass |
| Step 1 | The word becomes the blank. | 5 | F-1-6 |
| Step 2 | Due words return as open questions. | 6 | F-1-8 |
| Step 2 | Capitalisation does not affect marking. | 5 | Covered by `case-insensitive-marking` |
| Step 3 | Wrong guesses become confusion pairs. | 5 | Covered by `confusion-pairs` |
| Step 3 | Use them to sharpen word choice. | 6 | F-1-9 |
| Limits | Context Cloze has no dictionary, generated text, public decks, social feed, or streak. | 13 | F-1-10 |
| Limits | Only add text you may store. | 6 | Pass |
| Limits | Your vocabulary remains in this browser unless you export it. | 10 | Covered by `local-storage` |
| Paid section | Pay $12 once for unlimited words and the full confusion-pair history. | 11 | Covered by `free-limit` and `paid-license` |
| Paid section | Practice, 50 words, and exports remain free. | 7 | F-1-11 |
| Paid section | Checkout and refunds are handled by Sociobot/Dodo. | 7 | F-1-12 |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Practice your own words by typing them into sentences. | 9 | F-1-6 and F-1-19 |
| Context Cloze is for independent language learners who recognise a word but struggle to retrieve it while writing or speaking. | 20 | Pass |
| Add a word with a sentence, then answer scheduled cloze prompts. | 10 | F-1-6 and F-1-17 |
| Incorrect guesses become confusion pairs. | 5 | Covered by `confusion-pairs` |
| Saves words, sentences, due dates, and answers in IndexedDB. | 9 | Covered by `local-storage`; F-1-17 jargon |
| Matches typed answers with Unicode normalisation and case folding. | 9 | F-1-13 and F-1-17 |
| Updates each word's due date after an answer. | 8 | Covered by `typed-scheduling` |
| Shows repeated wrong guesses beside the intended words. | 7 | Covered by `confusion-pairs` |
| Imports and exports a versioned JSON file with practice history. | 10 | Covered by `json-export`; F-1-17 jargon |
| Reloads offline after the service worker finishes the first visit. | 10 | Covered by `offline-reload`; F-1-17 jargon |
| Keeps demo data in a separate `context-cloze-demo` database. | 8 | Covered by `demo-isolation`; F-1-17 jargon |
| The free tier holds 50 words. | 6 | Covered by `free-limit` |
| A $12 one-time personal license removes that limit and shows the full confusion history. | 14 | Covered by `free-limit` and `paid-license` |
| Checkout and license verification use the Sociobot billing API. | 9 | F-1-12, F-1-15, and F-1-17 |
| Practice and exports do not need a license. | 8 | F-1-11/F-1-19 |
| Requires Node.js 20 or newer. | 5 | Verified operational instruction; technical by necessity |
| Open http://localhost:5173. | 2 | Pass |
| Use http://localhost:5173/demo for the isolated sample workspace. | 7 | Pass |
| `npm test` runs model tests, every claim test, accessibility checks, and the 390 px layout check in Chromium. | 18 | Verified operational instruction |
| The reproducible production command is `npm run build`. | 8 | Verified operational instruction |
| It writes the static deploy to `dist/`, with `dist/index.html` at its root. | 12 | Verified operational instruction |
| To inspect the production build: | 5 | Pass as an instructional lead-in |
| Real and demo vocabulary use separate IndexedDB databases. | 8 | Covered by `demo-isolation`; F-1-17 jargon |
| No analytics, third-party font, or runtime script is included. | 9 | F-1-14 |
| A license token is kept in localStorage and sent only to `api.sociobot.in` for verification. | 14 | F-1-15 and F-1-17 |
| Read the in-app `/privacy` and `/terms` pages for the full policy. | 11 | Pass |
| Keep regular JSON exports if the vocabulary matters to you. | 10 | F-1-17 jargon |
| Clearing browser site data also clears the local vocabulary. | 9 | F-1-16 |
| MIT licensed. | 2 | Pass |
| The generated environmental artwork is original to this product. | 9 | Provenance is documented in `.factory/design.md` |

### Headings, actions, and terms

- No heading or action exceeds 22 words. The `h1`/`h2` outline is ordered.
- Buttons and action links use result-naming verbs: **Try it with sample data**,
  **Add your words**, **Add your first word**, **Save word**, **Export JSON**,
  **Import JSON**, and **Buy for $12 once**. F-1-17 concerns format jargon,
  not the presence of verbs.
- **Notice close calls** and **Keep a larger word archive** fail the
  out-of-context heading check (F-1-18).
- Terminology is otherwise stable for **word**, **sentence**, **due words**,
  **demo**, **confusion pair**, **JSON export**, and **one-time license**.
  Collection naming and practise/practice spelling are not stable (F-1-19).

## Demo and sandbox evidence

- `/demo` opens from the landing primary action in one click with eight
  realistic multilingual entries, five due words, and five previous answers.
- The banner persists and says **“Demo — sample data, nothing is saved to your
  vocabulary”**, with **Reset demo** and **Start for real**.
- Adding `tenacious` produced nine demo words; Reset restored eight and removed
  it. During demo, IndexedDB counts were `context-cloze-demo: 8` and
  `context-cloze-real: 0`; leaving cleared demo and opened an empty real store.
- A separate run created a real `keepsake` record before entering demo. After
  changing demo data and choosing Start for real, `keepsake` remained and the
  demo-only word did not appear.
- A full demo practice emitted no cross-origin requests. After the service
  worker controlled `/demo`, offline reload retained the demo heading and all
  eight words. No console or page errors occurred.
- Isolation, reset, exit, and offline behaviour pass. F-1-1 concerns only the
  required first post-click viewport.

## Declared claim test results

I cloned the repository without local working-tree state to
`/tmp/context-cloze-review1.J7mYRT`, ran `npm ci`, and ran every exact command
from `.factory/claims.json` individually.

| Claim ID | Result |
| --- | --- |
| `demo-isolation` | PASS |
| `typed-scheduling` | PASS |
| `case-insensitive-marking` | PASS |
| `full-session` | PASS |
| `unicode-rtl` | PASS |
| `json-export` | PASS |
| `confusion-pairs` | PASS |
| `local-storage` | PASS |
| `offline-reload` | PASS |
| `free-limit` | PASS |
| `paid-license` | PASS |

All declared claim tests pass and assert their stated observable outcomes. The
inventory is nevertheless incomplete; F-1-6 through F-1-16 identify the
unlisted or broader claims.

## Structure, links, accessibility, and build

- `npm test`: PASS — 6 Vitest and 20 Chromium tests.
- `npm run build`: PASS — `dist/` produced; initial JavaScript is 10.97 KB
  gzip and CSS is 4.41 KB gzip.
- `npm run test:live`: PASS — home 200, unknown route 404, checkout 303 to
  `checkout.dodopayments.com`, invalid license rejected.
- `/opt/fleet/lib/verify-url.sh`: PASS — title, `lang`, one `h1`, `main`, image
  alt, button names, and no console/page errors on home.
- Live Axe at 390 px: `/`, `/demo`, `/privacy`, `/terms`, and the 404 have zero
  violations. `/offline` has the serious contrast violation in F-1-3.
- Every known route deep-links and reloads. New SPA navigation focuses the new
  `h1`; back navigation focus also works, but scroll restoration fails (F-1-4).
- Internal links and assets return 200. The checkout follows to a 200 Dodo
  session, and Param Factory returns 200. Unknown URLs return a styled HTTP 404.
- Home and app routes have one `h1`, consistent header/footer, favicon,
  canonical, description, and the original 1200 × 630 social image. Route
  social metadata and 404 metadata fail as described in F-1-5.
- At 390 px there is no horizontal overflow. Reset demo, Start for real, and
  the compact home link measure at least 44 × 44 px. Reduced-motion rules are
  present. Import JSON still lacks visible focus (F-1-2).
- The night-archive art, clipped paper forms, palette, and typography match
  `.factory/design.md` and are recognisably product-specific rather than a
  generic SaaS template.

## History recheck

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.
I read the existing handoff and all three verification reports. Every earlier
reported product finding remains fixed:

| Earlier finding | Fresh result |
| --- | --- |
| Checkout returned 404 | Fixed: API returns 303 and reaches a 200 Dodo checkout session. |
| Demo controls/wordmark below 44 px | Fixed: 95.6 × 44, 95.6 × 44, and 44 × 44 px. |
| Unknown routes returned soft 200 | Fixed: unknown route returns HTTP 404 with the designed page. |
| Case-insensitive claim absent | Fixed: claim entry and tagged browser test pass. |
| Malformed JSON exposed parser text | Fixed: actionable Context Cloze export message. |
| Scheduling test did not inspect storage | Fixed: before/after exported scheduling fields are asserted. |
| JSON test did not prove a full round trip | Fixed: items and reviews are cleared, restored, and compared. |
| Paid test did not prove 51 words/full history | Fixed: both are asserted with a valid fixture. |
| Static assets lacked fingerprints/immutable caching | Fixed: hashed assets return one-year immutable caching. |

The previous handoff's unforced old-worker/new-worker transition remains a
verification limitation, not a public claim failure: current worker control,
offline reload, versioned cache output, and update code are present.

## Missed leverage

No missing AI feature is warranted. Learner-supplied sentences are central to
the brief, and generated text would weaken that ownership while adding an
online privacy/cost path. Bulk paste plus JSON backup/restore cover the obvious
import/export need. Sync would contradict the local-first default unless it
were a separately consented feature; the brief does not imply it.

## What would make this perfect

Resolve F-1-1 through F-1-20, then rerun every claim command, the full test and
build, live network/offline checks, all-route Axe including `/offline`, the
keyboard focus path through Import JSON, route metadata inspection, link crawl,
and back/forward scroll restoration. The next review should begin from a fresh
phone context and must show an actual seeded cloze exercise immediately after
the single demo click.
