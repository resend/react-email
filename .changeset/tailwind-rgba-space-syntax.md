---
"react-email": patch
---

Convert Tailwind `rgba()` colors written in space/slash syntax (e.g. `rgba(255 0 128 / 0.5)`) to the comma syntax email clients like Outlook understand, the same as `rgb()` already does. Legacy comma `rgba(r, g, b, a)` is left untouched.
