---
"@react-email/editor": patch
---

fix: skip editor-only filler paragraphs when composing the email

The trailing empty paragraph the editor appends after a table or section (and the schema filler inside an otherwise empty cell) no longer renders as extra vertical space in the composed email. Intentional blank lines — empty paragraphs that follow a paragraph — are still rendered.
