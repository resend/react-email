---
"react-email": patch
---

Fix Tailwind padding classes on `<Section>` (e.g. `<Section className="p-4">`) landing on the outer `<table>` instead of the inner `<td>`. Section is now treated like `Container`, so its existing padding-to-`<td>` split (for Outlook/Klaviyo) also applies to Tailwind utilities.
