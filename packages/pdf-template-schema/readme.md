# @asym/pdf-template-schema

Phase 3 package shell for the Asym PDF Document Builder template schema.

## Purpose

This package will own shared document template types, runtime schema,
versioning primitives, variable domains, page settings, asset references,
render metadata, batch metadata, and audit-oriented model types.

## Public API Promise

The current public API is intentionally small:

- `pdfTemplateSchemaBoundary`
- `PdfTemplateSchemaBoundary`

These exports prove the package boundary is discoverable. Full template schema
exports begin in Phase 5.

## Non-goals

- No PDF editor UI.
- No DocRaptor API calls.
- No browser-only APIs.
- No tenant storage, auth, or queue integration.
- No concrete template schema implementation before Phase 5.

## Maturity

`phase-3-boundary`. The package is private to prevent accidental publication
while the fork is still defining package ownership.

## Development

```sh
pnpm --filter @asym/pdf-template-schema build
pnpm --filter @asym/pdf-template-schema typecheck
pnpm --filter @asym/pdf-template-schema test
```

Later `Asymmetric-al/core` support may add Bun or different task runners, but
this fork follows the current pnpm, Turbo, TypeScript, Vitest, and tsdown
toolchain first.
