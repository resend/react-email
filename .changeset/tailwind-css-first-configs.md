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

The preview server, `email export`, and the caniemail compatibility check all understand the Vite-style `?inline` and `?raw` suffixes on CSS imports, so the pattern above works the same in your project and inside the preview UI. The compatibility check also extracts the `theme` and `utility` props (in addition to `config`) when analyzing your template, so any caniemail incompatibilities in CSS produced by those props will surface as warnings.

Internal note: the exported `setupTailwind` helper now takes `{ config, cssConfigs }` instead of a positional `TailwindConfig`. Calling it with the old shape throws with a migration hint.
