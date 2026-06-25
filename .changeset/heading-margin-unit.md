---
"react-email": patch
---

Fix `Heading` margin props mangling unit values like `mx="2rem"` into the invalid `2rempx`; values that already carry a unit are now passed through untouched.
