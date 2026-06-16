---
"react-email": patch
---

Fix `Markdown` corrupting double quotes in `markdownCustomStyles`. Inline style values containing a `"` (e.g. `fontFamily: '"Times New Roman", serif'`) were escaped to the apostrophe entity `&#x27;` instead of `&quot;`, silently rewriting the quoted value. Double quotes are now escaped as `&quot;`.
