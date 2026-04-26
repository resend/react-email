# @asym/pdf-renderer

Phase 10 print shell foundation for the Asym PDF Document Builder print
renderer.

## Purpose

This package owns deterministic document serialization, print-ready HTML,
paged-media CSS foundations, renderer preflight, browser preview helpers, and
fixture utilities. Phase 10 adds the first schema-driven print shell around the
Phase 09 serializer output.

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
- `composePrintDocumentHtml`
- `ComposePrintDocumentHtmlInput`
- `ComposePrintDocumentHtmlResult`
- `PrintDocumentPageBox`

`composePdfDocumentHtml` accepts structured document JSON and returns
deterministic HTML plus structured CSS requirements, warnings, asset
references, and variable usage. It is separate from `composeReactEmail` and
does not render through React Email components.

`composePrintDocumentHtml` wraps serializer output in a full HTML document with
a deterministic `<style>` block, schema-validated page settings, escaped
document title, base print CSS variables, page-break helpers, keep-together
helpers, repeated table header CSS, and page-number placeholder classes.

## Phase 09 Behavior

The serializer walks nodes recursively and includes built-in renderers for
paragraphs, headings, links, images, buttons, columns, table nodes, and explicit
variable nodes. Unknown container nodes render their children with a warning.
Unknown leaf nodes are omitted with a warning.

Variable usage is collected only from structured variable nodes such as
`variable` or `variableReference`. Raw text like `{{ donor.name }}` is treated
as normal text in Phase 09.

## Phase 10 Behavior

The print shell supports Letter, A4, Legal, and custom page sizes; portrait and
landscape orientation; four-sided margins; escaped document titles; and
deterministic print CSS. Page settings are parsed through
`DocumentPageSettingsSchema` from `@asym/pdf-template-schema`.

DocRaptor compatibility notes:

- DocRaptor and Prince support `@page` for page size, orientation, and margins:
  https://docraptor.com/css-paged-media
- DocRaptor applies print media rules by default for PDF output:
  https://docraptor.com/documentation/api/parameters
- Page margins are CSS-driven and can reserve space for page-region content:
  https://docraptor.com/documentation/article/1067969-margins-bleed

## Non-goals

- No React editor UI.
- No DocRaptor credentials or direct API calls.
- No DocRaptor request payloads or render modes before Phase 11.
- No browser preview fidelity guarantees before Phase 12.
- No integrated header/footer system before Phase 21.
- No tenant storage, auth, queue, or core app imports.
- No string-replacement merge engine.

## Maturity

`phase-10-print-shell`. The package remains private to prevent accidental
publication while renderer contracts are still being built.

## Development

```sh
pnpm --filter @asym/pdf-renderer build
pnpm --filter @asym/pdf-renderer typecheck
pnpm --filter @asym/pdf-renderer test
```

Later `Asymmetric-al/core` support may add Bun or different task runners, but
this fork follows the current pnpm, Turbo, TypeScript, Vitest, and tsdown
toolchain first.
