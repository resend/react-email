---
"@react-email/editor": patch
---

Fix the bubble menu losing its layout and theme in Next.js 16.4 production builds with Turbopack. The `data-re-bubble-menu` attribute, `className`, `style` and other props now go on a wrapper element that the editor renders inside TipTap's positioned menu element. Selectors on `[data-re-bubble-menu]` and on your `className` still match the visible menu. Rules that set `position` or `z-index` on them now apply to that inner element, not to the positioned one.
