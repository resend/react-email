---
"@react-email/editor": patch
---

Select all (Mod-a) with the cursor in the email body now selects the body instead of the whole document, so a copy no longer carries the theme node, deleting or typing over the selection keeps the theme, and a command after it (bold, a color) still applies to the whole body. Inside a code block or a column, Mod-a still selects that block first.
