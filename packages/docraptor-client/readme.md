# @asym/docraptor-client

Phase 3 package shell for the server-only DocRaptor client.

## Purpose

This package will own DocRaptor sync rendering, async rendering, status
polling, test mode, error normalization, retry metadata, and request metadata.
It is the only future package that should talk directly to the DocRaptor API.

## Public API Promise

The current public API is intentionally small:

- `docraptorClientBoundary`
- `DocRaptorClientBoundary`

These exports prove the server-only package boundary. Actual DocRaptor client
APIs begin in Phase 8.

## Non-goals

- No browser entry point.
- No React editor UI.
- No template schema implementation.
- No DocRaptor credentials, environment variable reads, or network calls in
  Phase 3.
- No tenant storage, auth, queue, or core app imports.

## Maturity

`phase-3-boundary`. The package is private to prevent accidental publication
while the server-only API is still being designed.

## Development

```sh
pnpm --filter @asym/docraptor-client build
pnpm --filter @asym/docraptor-client typecheck
pnpm --filter @asym/docraptor-client test
```

Later `Asymmetric-al/core` support may add Bun or different task runners, but
this fork follows the current pnpm, Turbo, TypeScript, Vitest, and tsdown
toolchain first.
