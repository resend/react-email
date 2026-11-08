---
"react-email": patch
---

Fix stacked media variants (e.g. `sm:dark:bg-black`) leaving a nested `@media` inside a style rule. The compatibility conversion now flattens `@media`-in-`@media` chains by combining the media conditions with `and`.
