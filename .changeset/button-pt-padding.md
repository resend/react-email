---
"react-email": patch
---

`<Button>` now converts `pt` padding values to `px` instead of treating them as `0`, so `style={{ padding: '9pt 15pt' }}` or `className="px-[15pt] py-[9pt]"` keeps its padding in every client and in the Outlook spacers.
