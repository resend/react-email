---
"@react-email/editor": patch
---

Theme font sizes set in the editor now render at the size typed. They stay in `em`, resolved against the parent's size instead of a fixed 14px, so a list item size now resolves against the list size and a nested list size against the list item size. The canvas no longer applies paragraph and list sizes twice inside lists.
