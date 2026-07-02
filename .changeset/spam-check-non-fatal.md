---
"@react-email/ui": patch
---

Stop failing `email build` when the spam check API errors or times out — the build now logs a warning and continues without a baked-in spam score.
