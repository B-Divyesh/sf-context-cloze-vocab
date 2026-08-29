# Landing copy audit

Audited 2026-08-29 after polish round 5. Counts treat prices, email addresses,
URLs, and hyphenated terms as one word. No public sentence
exceeds 22 words or contains a banned marketing word. Every claim-like line
below names its matching entry in `.factory/claims.json`.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| Your words · your sentences | 4 | Clear descriptor |
| Recall words inside sentences | 4 | Clear job-first h1 |
| For independent learners who recognise words but cannot retrieve them while writing or speaking. | 14 | Clear audience and situation |
| Try it with sample data | 5 | Primary result-naming action |
| Add your words | 3 | Real first-step action |
| Opens eight sample words. | 4 | `demo-sample-count` |
| Your word list stays untouched. | 5 | `demo-isolation` |
| Stored on this device | 4 | `local-storage` |
| Works offline after your first visit | 6 | `offline-reload` |
| Free for 50 words | 4 | `free-limit` |
| A blank notebook waits under a lamp beside a rainy night window. | 12 | Accurate image alternative |
| Add a word and a sentence. | 6 | Direct instruction |
| Context Cloze hides the word. | 5 | `typed-cloze` |

The first screen states the job, audience, primary action, next result, and
three tested facts. The primary sample action remains inside the first 390 ×
844 viewport.

## Product workspace and states

| Copy | Words | Result |
| --- | ---: | --- |
| Opening your word list… | 4 | Loading state |
| Your first blank will appear here | 6 | Empty-state heading |
| Add a word and a sentence that uses it. | 9 | Empty-state instruction |
| You can then start a typed review. | 7 | `typed-cloze` |
| Saved words will appear here. | 5 | Empty-list state |
| Paste one word per line. | 5 | `word-list-paste` |
| Add each sentence in the next step. | 7 | `word-list-paste` |
| Add a sentence for “zealous” | 5 | Ordered sentence-step heading |
| Use the word exactly as written. | 6 | Sentence-step instruction |
| You will see the next word after saving. | 8 | `word-list-paste` |
| Add a sentence before practising this word. | 7 | Pending-word state |
| Add a sentence before starting practice. | 6 | No-ready-word state |
| A tab works instead of the \| mark. | 8 | `tab-bulk-entry` |
| Backups include your words, sentences, schedule, and answer history. | 9 | `backup-roundtrip` |
| Type the missing word | 4 | Practice instruction |
| A short session uses only the words due today. | 9 | `due-session-only` |
| You can practise every word or add another sentence. | 9 | Empty due-state next steps |
| Wrong answers | 2 | Plain confusion-section label |
| These pairs come from your incorrect answers. | 7 | `confusion-pairs` |
| Wrong guesses will appear here beside the intended word. | 9 | Empty confusion state |
| The free view shows three pairs. | 6 | `free-confusion-limit` |
| The one-time license shows the full list. | 8 | `paid-license` |

Actions consistently name their result: **Save word**, **Check answer**,
**Save words and add sentences**, **Save sentence and continue**, **Practise
due words**, **Practise all words**, **Download backup**, **Restore backup**,
**Reset demo**, and **Start for real**.

## Explanation, storage, and license

| Copy | Words | Result |
| --- | ---: | --- |
| Practice steps | 2 | Plain section label |
| How sentence practice works | 4 | Clear section heading |
| Paste a word and a sentence you trust. | 8 | Direct instruction |
| Each saved word becomes a blank. | 7 | `typed-cloze` |
| Due words return as questions. | 5 | `due-queue` |
| Capitalisation does not affect marking. | 5 | `case-insensitive-marking` |
| Wrong guesses become confusion pairs. | 5 | `confusion-pairs` |
| Review the words you confused. | 6 | Direct instruction |
| Your content and storage | 4 | Plain section label |
| You choose every sentence | 4 | Clear ownership heading |
| Only add text you may store. | 6 | Scope instruction |
| Your word list remains in this browser unless you download a backup. | 12 | `local-storage` |
| Pay $12 once for unlimited words and the full confusion-pair history. | 11 | `free-limit`, `paid-license` |
| The free list holds 50 words. | 6 | `free-limit` |
| Buy for $12 once — opens secure checkout | 7 | `checkout-link` |
| For license or refund questions, email support@sociobot.in. | 7 | Contact instruction, not a billing claim |
| Read the license terms. | 4 | Legal-page link |
| Type the missing word in sentences you chose. | 8 | Plain footer description |
| Version 1.0.0 | 2 | Build identifier |

## Terminology

| Concept | One term used |
| --- | --- |
| Saved collection | word list |
| User-provided context | sentence |
| Missing-word activity | practice |
| Incorrect guess and target | confusion pair |
| Time-based prompts | due words |
| Isolated sample mode | demo |
| Portable file | backup |
| Saved word without context | word that needs a sentence |
| Paid entitlement | one-time license |

Catalog description: “Paste a word list, add each sentence, and practise every
missing word.” It has 12 words, starts with a verb, and is 70 characters.
