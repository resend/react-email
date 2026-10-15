---
"@react-email/ui": patch
---

The compatibility check now applies `--esbuild-plugins` when it bundles a template that passes `config`, `theme` or `utility` to `<Tailwind>`, so templates whose imports need a plugin no longer log a build error.
