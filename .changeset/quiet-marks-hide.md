---
'react-email': patch
---

Leave the direction marks U+200E and U+200F out of the `<Preview>` padding, so spam filters such as rspamd no longer score it as hidden text. The padding sequence is now `\xa0‌​‍﻿`; if you post-process rendered HTML by matching the old sequence, update it.
