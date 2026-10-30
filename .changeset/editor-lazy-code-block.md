---
"@react-email/editor": patch
---

Load react-email's `CodeBlock`, with its Prism grammars and themes, only when an email with a code block is rendered, instead of in every bundle that mounts the editor.
