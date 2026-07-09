---
"@react-email/editor": patch
---

Remove dangling `styles/link-bubble-menu.css`, `styles/button-bubble-menu.css`, and `styles/image-bubble-menu.css` export entries. These pointed to files that were never generated or published; the link, button, and image bubble menu styles are already bundled into `styles/bubble-menu.css`.
