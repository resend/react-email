---
"react-email": patch
---

Fix Tailwind classes on `<Section>` padding landing on the outer `<table>` instead of the inner `<td>`. `Section`, `Column`, and `Row` are now treated as elements so Tailwind inlines their utilities onto the right tag, and Section keeps its padding-to-`<td>` split for Outlook/Klaviyo.
