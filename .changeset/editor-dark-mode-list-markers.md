---
"@react-email/editor": patch
---

Keep native list markers visible in dark-mode mail clients. Apple Mail / iOS auto-darken light emails by recoloring text but leave `list-style` markers at their original color, so bullets vanished on the darkened background. The serialized email head now ships a `prefers-color-scheme: dark` rule that gives `li::marker` an explicit color.
