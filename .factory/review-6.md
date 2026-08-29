# Adversarial first-read review 6 — Context Cloze

**Verdict: PASS.** Reviewed 2026-08-29 against live production at
https://context-cloze-vocab.sociobot.in and a clean clone of commit
f228d5c82f9846c89b292096ae94a576567da58a. Zero blocking, major, or minor
findings remain; no F-6-k identifier is issued.

## Cold first read

I opened fresh no-storage contexts at 390 × 844 and 1440 × 900 without
scrolling.

| Question | First-read answer | Exact visible evidence |
| --- | --- | --- |
| What does it do? | It practises retrieving a learner's own words in sentences. | “Recall words inside sentences” |
| Who is it for? | Independent learners who recognise words but cannot retrieve them while writing or speaking. | “For independent learners who recognise words but cannot retrieve them while writing or speaking.” |
| What should I click first? | Try the seeded sample. | “Try it with sample data” and “Opens eight sample words. Your word list stays untouched.” |

The primary action and all three facts (local, offline after first visit, free
for 50 words) were visible in both first screens. There were no console or page
errors. This gate passes.

## Copy audit

Counts treat URLs, prices, email addresses, commands, and hyphenated terms as
one word. Every landing and README prose sentence is listed below. No sentence
exceeds 22 words. No banned marketing adjective, unexplained product jargon,
inconsistent term, metaphorical section heading, or non-result-naming action
was found. Product/privacy/billing claims have a matching listed claim; run and
developer instructions are verified operational instructions rather than
product claims.

### Landing page

| Sentence | Words | Check |
| --- | ---: | --- |
| For independent learners who recognise words but cannot retrieve them while writing or speaking. | 14 | Clear audience |
| Opens eight sample words. | 4 | demo-sample-count |
| Your word list stays untouched. | 5 | demo-isolation |
| Stored on this device | 4 | local-storage |
| Works offline after your first visit | 6 | offline-reload |
| Free for 50 words | 4 | free-limit |
| A blank notebook waits under a lamp beside a rainy night window. | 12 | Useful alt text |
| Add a word and a sentence. | 6 | Direct instruction |
| Context Cloze hides the word. | 5 | typed-cloze |
| Add a word and a sentence that uses it. | 9 | Direct instruction |
| You can then start a typed review. | 7 | typed-cloze |
| Saved words will appear here. | 5 | Clear empty state |
| Paste one word per line. | 5 | word-list-paste |
| Add each sentence in the next step. | 7 | word-list-paste |
| Use the word exactly as written. | 6 | Clear instruction |
| You will see the next word after saving. | 8 | word-list-paste |
| Add a sentence before practising this word. | 7 | Clear next step |
| A tab works instead of the \| mark. | 8 | tab-bulk-entry |
| Backups include your words, sentences, schedule, and answer history. | 9 | backup-roundtrip |
| Paste a word and a sentence you trust. | 8 | Direct instruction |
| Each saved word becomes a blank. | 7 | typed-cloze |
| Due words return as questions. | 5 | due-queue |
| Capitalisation does not affect marking. | 5 | case-insensitive-marking |
| Wrong guesses become confusion pairs. | 5 | confusion-pairs |
| Review the words you confused. | 6 | Direct instruction |
| Only add text you may store. | 6 | Scope instruction |
| Your word list remains in this browser unless you download a backup. | 12 | local-storage |
| Pay $12 once for unlimited words and the full confusion-pair history. | 11 | free-limit; paid-license |
| The free list holds 50 words. | 6 | free-limit |
| For license or refund questions, email support@sociobot.in. | 7 | Concrete support route |
| Read the license terms. | 4 | Clear link action |
| Type the missing word in sentences you chose. | 8 | Clear footer description |

The remaining non-sentence text was also checked. “Your words · your
sentences”, “Recall words inside sentences”, “Practice steps”, “How sentence
practice works”, “Your content and storage”, “Remove the 50-word limit”, and
“Back up or restore your word list” name their sections. Actions name their
result: “Try it with sample data”, “Add your words”, “Save word”, “Check
answer”, “Download backup”, “Restore backup”, “Reset demo”, “Start for real”,
and “Buy for $12 once — opens secure checkout”. There is no copy finding or
proposed rewrite.

### README

| Sentence | Words | Check |
| --- | ---: | --- |
| Practise your word list with typed sentence blanks. | 8 | typed-cloze |
| Context Cloze is for independent language learners who recognise a word but cannot retrieve it while writing or speaking. | 19 | Clear audience |
| Paste one word per line, then add each sentence in order. | 11 | word-list-paste |
| Type the missing word when it is due. | 8 | due-queue |
| Wrong guesses become confusion pairs. | 5 | confusion-pairs |
| Turns each saved word into a blank that you answer by typing. | 12 | typed-cloze |
| Accepts a pasted word list before you add each sentence. | 11 | word-list-paste |
| Keeps your word list in this browser during practice. | 9 | local-storage |
| Accepts right-to-left words and accented answers typed in either common form. | 11 | unicode-rtl; unicode-normalisation |
| Updates each word’s next due date after an answer. | 9 | typed-scheduling |
| Counts repeated wrong guesses beside the intended word. | 8 | confusion-pairs |
| Downloads and restores backups with word, schedule, and answer history. | 10 | backup-roundtrip |
| Works offline after the first visit. | 6 | offline-reload |
| Keeps the sample word list separate and never reads or changes your real word list. | 14 | demo-isolation |
| The free list holds 50 words. | 6 | free-limit |
| A $12 one-time personal license removes that limit and shows the full confusion history. | 14 | free-limit; paid-license |
| The purchase link opens Sociobot’s secure checkout. | 7 | checkout-link |
| A license token stays in browser storage and is sent only to Sociobot to check the license. | 17 | license-token-privacy |
| Requires Node.js 20 or newer. | 6 | Run instruction |
| Open http://localhost:5173. | 2 | Run instruction |
| Use http://localhost:5173/?demo=1 for the isolated sample word list. | 7 | Run instruction |
| npm test runs model tests, claim tests, accessibility checks, and the 390 px layout check in Chromium. | 17 | Verified in clean clone |
| npm run build writes the static deploy to dist/, with dist/index.html at its root. | 16 | Verified in clean clone |
| Inspect it with npm run preview. | 6 | Run instruction |
| After deployment, run npm run test:live for routing and billing checks. | 11 | Run instruction |
| Run npm run test:live:browser for the cold demo, offline, Axe, focus, privacy, mobile, and storage-isolation checks. | 18 | Run instruction |
| Publish the contents of dist/ as a static site. | 9 | Deploy instruction |
| Keep staticwebapp.config.json at the site root so real routes, headers, caching, and the designed 404 response remain active. | 19 | Deploy instruction |
| The Param Factory manages the production deployment and DNS. | 8 | Scope statement |
| This app includes no advertising, behavioural analytics, third-party fonts, or third-party scripts. | 12 | no-tracking-resources |
| Use your browser’s site-data controls to remove stored app data. | 10 | clear-site-data |
| Read the in-app /privacy and /terms pages for the full policy. | 11 | Clear link instruction |
| Real and sample word lists use separate IndexedDB databases. | 9 | Developer note; demo-isolation |
| Backup files use JSON format. | 5 | Developer note, not public panel |
| MIT licensed. | 2 | License statement |

## Demo, sandbox, privacy, and claims

The landing action opened /?demo=1 in one click. In a fresh 390px context, the
first post-click screen already showed “The quiet melody remained _____ after
the concert ended.”, its meaning, the Your answer field, and Check answer. The
final core control ended at 628px, inside the 844px viewport. The persistent
banner said “Demo — sample data, nothing is saved to your word list” and
contained working Reset demo and Start for real actions.

Direct demo entry created only context-cloze-demo storage. Reset restored eight
words, and Start for real removed the sample from the real workspace. The
declared demo-isolation test additionally created a real keepsake word, proved
no demo DOM or storage exposed it, added/reset a demo-only word, and confirmed
the real list did not change.

Playwright's live request log for the demo flow had no cross-origin request.
After the first live demo load received service-worker control, an offline
reload of /?demo=1 retained eight sample words without a console error.

From /tmp/context-cloze-review6.kAmj0d/repo, after npm ci, I ran every one of
the 23 exact claim commands in .factory/claims.json. All passed:
demo-sample-count, demo-isolation, typed-cloze, typed-scheduling, due-queue,
case-insensitive-marking, full-session, unicode-rtl, unicode-normalisation,
backup-roundtrip, confusion-pairs, no-tracking-resources, local-storage,
checkout-link, tab-bulk-entry, word-list-paste, due-session-only,
free-confusion-limit, license-token-privacy, clear-site-data, offline-reload,
free-limit, and paid-license.

The full clean-clone npm test passed 12 Vitest checks and 40 Chromium checks.
npm run build passed, wrote dist/index.html, and produced a 12,026-byte gzipped
application JavaScript asset. No listed claim is untested.

## Earlier-review history

I read every prior review, polish record, handoff, demo contract, and copy
audit. The following table records a fresh live/source confirmation for every
earlier finding, rather than relying on its previous status.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Demo first viewport has seeded cloze, input, and Check answer. |
| F-1-2 | Restore backup has visible :focus-within; keyboard regression passes. |
| F-1-3 | /offline uses the contrast-safe mark and is in the Axe suite. |
| F-1-4 | Live Back restored home scroll and h1 focus. |
| F-1-5 | All public routes and 404 have distinct title, description, canonical, OG/Twitter, and apple-touch metadata. |
| F-1-6 | typed-cloze saves, blanks, and accepts a typed word. |
| F-1-7 | demo-sample-count measures eight samples. |
| F-1-8 | due-queue observes a due question. |
| F-1-9 | The untestable learning-outcome promise is absent. |
| F-1-10 | The unproved negative-feature list is absent. |
| F-1-11 | The unproved free-practice/export promise is absent. |
| F-1-12 | checkout-link follows the Sociobot URL to a Dodo redirect. |
| F-1-13 | unicode-normalisation proves composed/decomposed matching. |
| F-1-14 | no-tracking-resources and the live request log find no external resource. |
| F-1-15 | license-token-privacy checks storage and its sole destination. |
| F-1-16 | clear-site-data checks both databases and the license before reload. |
| F-1-17 | Public backup controls are plain-language Download/Restore backup. |
| F-1-18 | Confusion and paid headings are plain and specific. |
| F-1-19 | Public copy consistently uses “word list” and “practise.” |
| F-1-20 | External checkout and factory links identify their destination. |
| F-2-1 | Storage-clear proof tests original real/demo records, not only reseeding. |
| F-3-1 | Demo isolation creates real data first and proves no demo read or write. |
| F-3-2 | The how-to eyebrow is “Practice steps.” |
| F-3-3 | The confusion eyebrow is “Wrong answers.” |
| F-3-4 | The hero caption is the direct add-word/add-sentence instruction. |
| F-3-5 | Public generated-art provenance copy is absent. |
| F-3-6 | Paid and Terms use a plain support route, not unproved merchant claims. |
| F-3-7 | The ownership eyebrow is “Your content and storage.” |
| F-4-1 | The checkout test asserts the hosted checkout redirect. |
| F-4-2 | tab-bulk-entry tests tab-separated input. |
| F-4-3 | due-session-only excludes a future word. |
| F-4-4 | free-confusion-limit measures three unlicensed pairs. |
| F-4-5 | Practice and both 404 forms use plain headings. |
| F-5-1 | word-list-paste accepts bare words and opens ordered sentence entry in demo storage. |
| F-5-2 | The public landing panel no longer exposes JSON-format copy. |

## Structure and missed leverage

Live checks returned 200 for /, /demo, /privacy, /terms, /offline, robots,
sitemap, favicon, and manifest; an unknown URL returned the designed 404 with
HTTP 404. Each app route had exactly one h1, a main landmark, route-specific
metadata, and expected favicon/icons. Internal links resolved, mail links were
explicit, the checkout returned 303 to HTTPS Dodo, and Param Factory returned
200. Header/footer structure is consistent and contains Privacy and Terms. Live
navigation moved focus to the new h1; a footer Privacy → Back check restored the
home position (5,332px) and focus.

The response CSP, including frame-ancestors as a response header, matches the
loaded resources. The dark rain-window art, serif sentence setting, clipped
paper surfaces, amber controls, and reduced-motion path match the documented
night-archive thesis. It is product-specific rather than a generic SaaS
template.

The brief calls for learner-supplied sentences and local typed recall. The
product already provides the implied one-per-line import, backup/export,
offline access, and isolated demo. An AI writing feature would alter that
privacy-preserving core rather than fill an obvious missing job; no decorative
AI integration or embedded provider key was found.

## What would make this perfect

Keep this evidence current after any copy, storage, routing, service-worker, or
checkout change by rerunning the clean-clone claim inventory and live browser
checks. No product change is required from this review.
