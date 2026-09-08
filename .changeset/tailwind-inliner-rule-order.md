---
"react-email": patch
---

Fix `<Tailwind>` and `inlineStyles()` reordering duplicate class rules, which broke cascade precedence. Rules now keep their original stylesheet source order when merged across classes, so a later declaration correctly overrides an earlier conflicting one even when other classes are defined in between. Variable resolution in the inliner is now independent of rule order as well.
