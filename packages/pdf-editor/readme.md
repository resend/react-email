# @asym/pdf-editor

Phase 08 compatibility package for the Asym PDF Document Builder React editor.

## Purpose

This package will own the PDF-first editor shell, TipTap/ProseMirror
extensions, document blocks, slash commands, inspector controls, preview
surfaces, and compatibility shims while the fork moves from email-first to
PDF-first.

## Public API Promise

The current public API is intentionally small:

- `pdfEditorBoundary`
- `PdfEditorBoundary`
- `PdfEditor`, `PdfEditorProps`, `PdfEditorRef`
- `DocumentEditor`, `DocumentEditorProps`, `DocumentEditorRef`
- `DocumentNode`
- `DocumentMark`
- `@asym/pdf-editor/react-email-compat`

The `react-email-compat` subpath re-exports public `@react-email/editor`
primitives under explicit `Reference` names. These adapters are temporary and
exist so future PDF work can depend on a package boundary without duplicating
the upstream editor.

The Phase 08 document/PDF names are exact aliases for the current React Email
editor primitives. They are the future-facing import path, but they do not yet
change editor behavior or rendering output.

## Non-goals

- No PDF-native editor shell implementation in Phase 08.
- No source import rewrites inside `@react-email/editor`.
- No PDF renderer implementation.
- No `composePdfDocumentHtml`; Phase 9 owns the print/PDF serializer.
- No `DocumentTheming`; the branding/theme phase owns PDF-specific theme
  semantics.
- No DocRaptor credentials or server-side API calls.
- No tenant storage, auth, queue, or core app imports.

## Maturity

The package now has a Phase 08 compatibility surface. The
`pdfEditorBoundary.maturity` metadata remains `phase-3-boundary` until a later
phase updates boundary metadata alongside real editor behavior. The package is
private to prevent accidental publication while the editor API is still being
designed.

## Development

```sh
pnpm --filter @asym/pdf-editor build
pnpm --filter @asym/pdf-editor typecheck
pnpm --filter @asym/pdf-editor test
pnpm asym:phase-08-document-names-smoke
```

Later `Asymmetric-al/core` support may add Bun or different task runners, but
this fork follows the current pnpm, Turbo, TypeScript, Vitest, React Testing
Library, and tsdown toolchain first.
