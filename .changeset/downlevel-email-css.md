---
"@react-email/tailwind": patch
---

fix(tailwind): downlevel CSS for email client compatibility

Rewrites modern CSS features that email clients don't support using css-tree AST:
- Unnests `@media` rules from inside selectors (CSS Nesting)
- Converts Media Queries Level 4 range syntax to legacy `min-width`/`max-width`
