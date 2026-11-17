---
"@react-email/editor": patch
---

Even out the spacing around nested list items in the email theming. List items now put all their spacing on top (`0.6em`) instead of splitting it (`0.3em` above and below), so the gap into and out of a nested list matches the gap between regular items. Top-level lists get `0.3em` more space above their first item.
