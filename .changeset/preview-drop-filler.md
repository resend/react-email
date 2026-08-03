---
"react-email": patch
---

Remove the hidden zero-width filler from `<Preview>`. The long run of `\xa0‌​‍‎‏﻿` near the top of `<body>` breaks SendGrid's click-tracking HTML rewriter, which truncates the message: the HTML part arrives empty (no body, no CTA) while the `multipart/alternative` plain-text part is unaffected, so it reads as intermittent. Removing only U+FEFF is not sufficient — verified against a live send. See #609, #1785, #1806.
