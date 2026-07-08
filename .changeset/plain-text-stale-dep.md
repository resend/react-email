---
"@react-email/render": patch
---

Stop relying on the unmaintained `html-to-text` package for the default plain text conversion. `plainText: true` now converts through a small hast-based walker (`hast-util-from-html`) that reproduces the previous output: images and `data-skip-in-text="true"` elements are skipped, headings are uppercased, and link hrefs are appended without brackets unless they match the link text. Passing `htmlToTextOptions` still routes through `html-to-text` so existing behavior is unchanged; that option is now deprecated and scheduled for removal in the next major, which will drop the stale dependency entirely.
