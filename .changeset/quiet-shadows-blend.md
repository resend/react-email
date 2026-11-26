---
"react-email": patch
---

`<Tailwind>` now uses a value that another class on the same element defines instead of the fallback, so `text-shadow-*` colors apply, gradients with an arbitrary position (`bg-radial-[at_25%_25%]`, `bg-linear-[25deg]`, `bg-conic-[from_45deg]`) keep their color stops, and `leading-*` holds when it comes before `text-*`. A variable set to `initial` or `inherit` now uses its fallback instead of inlining the keyword.
