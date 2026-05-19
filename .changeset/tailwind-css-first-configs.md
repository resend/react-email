---
"react-email": minor
---

Add `theme` and `utility` props to `<Tailwind>` for Tailwind v4 CSS-first configuration. Both accept a CSS string and can be combined with the existing `config` prop.

```tsx
import themeCss from './theme.css?inline';

<Tailwind theme={themeCss}>
  <div className="bg-brand font-display">Custom themed content</div>
</Tailwind>
```

Empty strings are no-ops. The base Tailwind theme and utilities are still loaded — `theme` and `utility` layer on top.

Internal note: the exported `setupTailwind` helper now takes `{ config, cssConfigs }` instead of a positional `TailwindConfig`. Calling it with the old shape throws with a migration hint.
