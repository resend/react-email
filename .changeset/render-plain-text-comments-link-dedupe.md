---
"@react-email/render": patch
---

Fix `unstableTextConversion` leaking HTML comments into plain-text output: React's `<!--$-->`/`<!--/$-->` Suspense markers and MSO conditional comments (e.g. from `<Button>`) no longer appear, and a link whose text matches its URL no longer repeats the URL when other text precedes it in the block.
