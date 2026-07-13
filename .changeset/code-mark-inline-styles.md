---
"@react-email/editor": patch
---

fix: apply inline styles stored on the `code` mark when composing the email

The `code` mark's serializer only read styles from the text node's attrs, so inline CSS captured on the mark itself (e.g. background, padding, or font styles imported from existing HTML) was dropped from the composed email. The mark's `style` attr is now merged into the rendered `<code>` element.
