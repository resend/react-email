---
"@react-email/editor": patch
---

Fix the bubble menu's Left alignment button never reading as active for left-aligned (default) content, persist an explicit left alignment to the HTML, and resolve inherited alignment from aligned ancestors (for example a paragraph inside a center-aligned table cell) so the button no longer reports `left` while the content is visually centered.
