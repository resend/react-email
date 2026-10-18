---
"react-email": patch
---

`<Button>` no longer drops a longhand padding of `0`, so `style={{ padding: '12px 20px', paddingTop: 0 }}` renders with no top padding instead of falling back to the shorthand's `12px`.
