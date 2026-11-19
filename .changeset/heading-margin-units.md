---
"react-email": patch
---

Fix `<Heading>` margin shortcuts (`m`, `mt`, `mx`, ...) appending `px` to values that already have a unit, such as `"1.5rem"`, and support `auto` and multi-value shorthands.
