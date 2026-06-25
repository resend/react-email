---
"react-email": patch
---

Fix `Button` emitting `mso-text-raise` without a unit on its Outlook padding spacer (e.g. `mso-text-raise:18`), which Outlook treats as invalid. The value now carries `px`, matching the unit React already adds on the button label.
