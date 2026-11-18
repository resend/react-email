---
'react-email': patch
---

Render spaces in `CodeBlock` as plain spaces. They were rendered as NBSP + zero-width joiner + zero-width space, so code copied from an email (for example `npm install resend`) failed when pasted into a terminal. To keep the Spark Mail fix from #2631, `CodeBlock` no longer renders a `<span>` that contains only whitespace: each whitespace span now wraps the token next to it.
