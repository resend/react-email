# @asym/pdf-editor

Phase 3 package shell for the Asym PDF Document Builder React editor.

## Purpose

This package will own the PDF-first editor shell, TipTap/ProseMirror
extensions, document blocks, slash commands, inspector controls, preview
surfaces, and compatibility shims while the fork moves from email-first to
PDF-first.

## Public API Promise

The current public API is intentionally small:

- `pdfEditorBoundary`
- `PdfEditorBoundary`
- `@asym/pdf-editor/react-email-compat`

The `react-email-compat` subpath re-exports public `@react-email/editor`
primitives under explicit `Reference` names. These adapters are temporary and
exist so future PDF work can depend on a package boundary without duplicating
the upstream editor.

## Non-goals

- No PDF editor shell implementation before Phase 9.
- No source import rewrites inside `@react-email/editor`.
- No PDF renderer implementation.
- No DocRaptor credentials or server-side API calls.
- No tenant storage, auth, queue, or core app imports.

## Maturity

`phase-3-boundary`. The package is private to prevent accidental publication
while the editor API is still being designed.

## Development

```sh
pnpm --filter @asym/pdf-editor build
pnpm --filter @asym/pdf-editor typecheck
pnpm --filter @asym/pdf-editor test
```

Later `Asymmetric-al/core` support may add Bun or different task runners, but
this fork follows the current pnpm, Turbo, TypeScript, Vitest, React Testing
Library, and tsdown toolchain first.
