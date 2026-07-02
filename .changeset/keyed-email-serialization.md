---
"@react-email/editor": patch
---

Avoid React key warnings when exporting editor content containing marked text. Serialized email nodes are now keyed at the mapped result boundary, so marks like bold, italic, and links no longer produce missing-key warnings during email export.
