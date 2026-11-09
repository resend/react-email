---
'@react-email/ui': patch
---

Scanning the emails directory no longer leaves a file handle open when a file can't be read, which crashed `email dev` on Node.js 25 and later. An unreadable file is now skipped with a warning instead of failing the whole scan.
