---
'@react-email/editor': patch
---

Buttons now render with `box-sizing: border-box`, so a full-width padded button no longer overflows its container in delivered emails. Buttons with an explicit size plus padding render slightly smaller, matching the canvas.
