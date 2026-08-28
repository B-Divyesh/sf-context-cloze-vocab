# Landing copy audit

Audited 2026-08-28. Counts treat hyphenated terms and prices as one word. No
visitor-facing sentence exceeds 22 words or contains a banned marketing word.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| Recall words inside sentences | 4 | Pass |
| For independent learners who recognise words but cannot retrieve them while writing or speaking. | 14 | Pass |
| Opens eight sample words. | 4 | Tested: `demo-sample-count` |
| Your word list stays untouched. | 6 | Tested: `demo-isolation` |
| Stored on this device | 4 | Tested: `local-storage` |
| Works offline after your first visit | 6 | Tested: `offline-reload` |
| Free for 50 words | 4 | Tested: `free-limit` |

## Key product copy

| Copy | Words | Result |
| --- | ---: | --- |
| Each saved word becomes a blank. | 7 | Tested: `typed-cloze` |
| Due words return as questions. | 5 | Tested: `due-queue` |
| Capitalisation does not affect marking. | 5 | Tested: `case-insensitive-marking` |
| Wrong guesses become confusion pairs. | 5 | Tested: `confusion-pairs` |
| Review the words you confused. | 6 | Plain instruction |
| Only add text you may store. | 6 | Plain instruction |
| Your word list remains in this browser unless you download a backup. | 12 | Tested: `local-storage` |
| Pay $12 once for unlimited words and the full confusion-pair history. | 11 | Tested: `free-limit`, `paid-license` |
| The free list holds 50 words. | 6 | Tested: `free-limit` |
| Buy for $12 once — opens secure checkout | 8 | Tested: `checkout-link` |

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
| Paid entitlement | one-time license |

Catalog description: “Practise your own words by typing them into sentence
blanks.” It has ten words, begins with a verb, and is under 120 characters.
