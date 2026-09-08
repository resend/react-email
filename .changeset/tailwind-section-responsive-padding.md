---
'react-email': patch
---

Responsive padding classes like `max-sm:px-5` on `<Section>` and `<Container>` now land on the inner `<td>` that carries the base padding, so they override it instead of stacking. Components marked with `markAsElement` can pass a `resolveTailwind` option to decide how Tailwind's resolved styles and classes map onto their props.
