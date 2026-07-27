---
'@react-email/editor': patch
---

Make body margin and padding theme-driven instead of hardcoded on the email `<Body>`. The `minimal` theme's body panel now includes a Margin input and defaults its padding inputs to `0`, so body spacing is visible and editable in the inspector and can be overridden per document. The `basic` theme keeps its `margin: 0; padding: 0` body reset with unchanged output.
