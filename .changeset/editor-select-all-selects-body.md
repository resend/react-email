---
"@react-email/editor": patch
---

Select all (Mod-a) with the cursor in the email body now selects the body instead of the whole document, so a copy no longer carries the theme node, and deleting the selection keeps the theme. Inside a code block or a column, Mod-a still selects that block first.
