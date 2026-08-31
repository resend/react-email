---
'@react-email/editor': patch
---

Buttons now render with `box-sizing: border-box` on the canvas and in the published email, so a full-width button with horizontal padding no longer overflows its container in delivered emails. A button with an explicit width or height plus padding now renders slightly smaller, matching what the canvas shows.
