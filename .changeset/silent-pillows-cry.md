---
"@react-email/ui": patch
---

Fix line and column calculation for CRLF line endings in the email validation diagnostics. A `\r\n` was being counted as two line breaks, so line and column numbers reported for templates authored with Windows line endings were off.
