---
"@react-email/editor": patch
---

Strip event handler attributes (`onclick`, `onerror`, ...) from pasted HTML, including HTML that carries the editor's own `node-*` classes.
