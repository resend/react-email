---
'@react-email/render': patch
---

Fix HTML entity encoding in style attributes

Fixes #1767 - Decodes HTML entities in style attributes to fix font-family declarations with quoted font names. Only decodes ampersands in href attributes to preserve HTML structure and avoid breaking attribute syntax.
