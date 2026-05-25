---
"@react-email/ui": patch
---

refuse outbound fetches whose hostname resolves to a private or reserved address (loopback, RFC1918, link-local incl. cloud metadata, ULA, multicast) to close a server-side request forgery vector in the preview server's email linter. the linter now also skips network probes for same-origin assets, so relative `<img src="/foo.png">` paths against the local dev server keep working without exposing it as an SSRF target.
