# @asym/pdf-renderer

Phase 3 package shell for the Asym PDF Document Builder print renderer.

## Purpose

This package will own deterministic document serialization, print-ready HTML,
paged-media CSS, renderer preflight, browser preview helpers, and fixture
utilities. DocRaptor remains the production PDF target, but direct DocRaptor
API calls belong in `@asym/docraptor-client`.

## Public API Promise

The current public API is intentionally small:

- `pdfRendererBoundary`
- `PdfRendererBoundary`

These exports prove the package boundary and dependency direction. Serializer
and print CSS APIs begin in Phase 6 and Phase 7.

## Non-goals

- No React editor UI.
- No DocRaptor credentials or direct API calls.
- No tenant storage, auth, queue, or core app imports.
- No production renderer implementation before later phases.

## Maturity

`phase-3-boundary`. The package is private to prevent accidental publication
while renderer contracts are still being designed.

## Development

```sh
pnpm --filter @asym/pdf-renderer build
pnpm --filter @asym/pdf-renderer typecheck
pnpm --filter @asym/pdf-renderer test
```

Later `Asymmetric-al/core` support may add Bun or different task runners, but
this fork follows the current pnpm, Turbo, TypeScript, Vitest, and tsdown
toolchain first.
