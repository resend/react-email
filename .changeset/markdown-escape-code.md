---
"react-email": patch
---

`<Markdown>` now escapes HTML inside code blocks and inline code. Code samples like `<b>bold</b>` were rendered as real HTML instead of showing the snippet.
