---
"@react-email/editor": patch
---

Emit active EmailTheming link styles in the Link mark's `renderHTML` so plain links carry inline color + underline in exported HTML. User inline styles still take precedence via the CSS cascade. `RESET_MINIMAL.link` now also ships `#0670DB` + underline.
