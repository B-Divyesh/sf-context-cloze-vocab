# Demo sandbox

- URL: `https://context-cloze-vocab.sociobot.in/demo` (local: `http://localhost:5173/demo`)
- Sample: eight learner-owned-style vocabulary entries, five due words, and five
  past incorrect answers that form four confusion pairs.
- Storage: IndexedDB database `context-cloze-demo`. Real data uses the separate
  `context-cloze-real` database. Demo mode never opens the real database.
- Reset: choose **Reset demo** in the persistent demo banner.
- Exit: choose **Start for real**. This clears the demo stores before opening the
  real workspace.
- Offline: visit the demo once, wait for the service worker, then disconnect and
  reload `/demo`.
