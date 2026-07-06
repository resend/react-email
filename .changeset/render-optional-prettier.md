---
"@react-email/render": patch
---

Make `prettier` an optional peer dependency of `@react-email/render`.

`prettier` (~8MB) was a hard dependency but is only used when rendering with `pretty: true`, which is off by default. It is now an optional peer dependency and loaded lazily via a dynamic `import()` at the format call site. Consumers who already have `prettier` installed get identical output; those who never opt into pretty rendering no longer pay the install/bundle cost. If `pretty: true` is requested without `prettier` installed, `render` returns the (semantically identical) unformatted HTML instead of failing, logging a one-time warning.
