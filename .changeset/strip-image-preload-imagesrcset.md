---
"@react-email/render": patch
---

Strip image preload links that carry `imagesrcset` or `imagesizes` without `as="image"`, so React-injected responsive-image hints no longer leak into rendered email HTML.
