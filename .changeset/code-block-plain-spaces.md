---
'react-email': patch
---

Render spaces in `CodeBlock` as plain spaces. They were rendered as NBSP + zero-width joiner + zero-width space, so code copied from an email (for example `npm install resend`) failed when pasted into a terminal.
