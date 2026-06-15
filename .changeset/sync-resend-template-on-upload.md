---
"@react-email/ui": patch
---

Update the existing Resend template on upload instead of always creating a new one. The "Upload to Resend" and "Bulk Upload" actions now look the template up by name and update it in place when exactly one matches, so re-uploading no longer produces duplicates (`welcome`, `welcome (1)`, ...).
