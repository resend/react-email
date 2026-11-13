---
"@react-email/editor": patch
---

Fix the bubble menu losing its layout and theme in Next.js 16.4 production builds with Turbopack. The `data-re-bubble-menu` attribute, `className` and `style` now go on an inner element, not on TipTap's positioned element.
