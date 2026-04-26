# @asym/pdf-renderer

Phase 09 serializer foundation for the Asym PDF Document Builder print
renderer.

## Purpose

This package owns deterministic document serialization, print-ready HTML,
paged-media CSS foundations, renderer preflight, browser preview helpers, and
fixture utilities. Phase 09 adds the first document/PDF serializer path while
keeping full print shell and page model work in Phase 10.

DocRaptor remains the production PDF target, but direct DocRaptor API calls
belong in `@asym/docraptor-client`.

## Public API Promise

The current public API is intentionally small:

- `pdfRendererBoundary`
- `PdfRendererBoundary`
- `composePdfDocumentHtml`
- `ComposePdfDocumentHtmlInput`
- `ComposePdfDocumentHtmlResult`
- `PdfDocumentCssRequirement`
- `PdfDocumentRenderWarning`
- `PdfDocumentAssetReference`
- `PdfDocumentVariableUsage`
- `PdfDocumentNodeRenderer`
- `PdfDocumentMarkRenderer`

`composePdfDocumentHtml` accepts structured document JSON and returns
deterministic HTML plus structured CSS requirements, warnings, asset
references, and variable usage. It is separate from `composeReactEmail` and
does not render through React Email components.

## Phase 09 Behavior

The serializer walks nodes recursively and includes built-in renderers for
paragraphs, headings, links, images, buttons, columns, table nodes, and explicit
variable nodes. Unknown container nodes render their children with a warning.
Unknown leaf nodes are omitted with a warning.

Variable usage is collected only from structured variable nodes such as
`variable` or `variableReference`. Raw text like `{{ donor.name }}` is treated
as normal text in Phase 09.

## Non-goals

- No React editor UI.
- No DocRaptor credentials or direct API calls.
- No full print shell, `@page` rules, margins, or page model before Phase 10.
- No tenant storage, auth, queue, or core app imports.
- No string-replacement merge engine.

## Maturity

`phase-09-serializer-foundation`. The package remains private to prevent
accidental publication while renderer contracts are still being built.

## Development

```sh
pnpm --filter @asym/pdf-renderer build
pnpm --filter @asym/pdf-renderer typecheck
pnpm --filter @asym/pdf-renderer test
```

Later `Asymmetric-al/core` support may add Bun or different task runners, but
this fork follows the current pnpm, Turbo, TypeScript, Vitest, and tsdown
toolchain first.
