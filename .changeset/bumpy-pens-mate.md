---
"@react-email/render": patch
---

Strip nul bytes from React 18 `renderToPipeableStream` output to prevent emails with multi-byte characters from being truncated.
