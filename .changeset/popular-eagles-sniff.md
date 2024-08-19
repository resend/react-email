---
"@react-email/render": major
"react-email": patch
---

Deprecated `renderAsync` and made `render` itself always async

## Why

Three reasons:

1. Better support of NextJS's latest versions
2. Being ready for future React API deprecations
3. Support for Suspense which allows for using async inside components

See https://github.com/resend/react-email/discussions/1144 for more info.

## How to upgrade

You just need to treat the promise returned from `render` properly
and then use the string the same as before. If you are using `renderAsync`,
you can just replace it with `render` and things should work the same.
