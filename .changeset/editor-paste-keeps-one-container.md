---
"@react-email/editor": patch
---

Pasting a whole-document copy, or a sent email's HTML, into the body no longer nests a container and a theme node per paste. The `container` and `globalContent` parse rules now only match directly under the doc, so inside the body a pasted container is unwrapped, a pasted theme is dropped, and a max-width table becomes a table.
