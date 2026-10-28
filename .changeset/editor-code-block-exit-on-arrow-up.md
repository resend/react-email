---
"@react-email/editor": patch
---

Set the code block's `exitOnArrowUp` option to `false` explicitly, like `exitOnArrowDown`, so it type-checks against `@tiptap/extension-code-block` 3.32 and arrow-up keeps its current behavior.
