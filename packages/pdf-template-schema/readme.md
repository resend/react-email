# @asym/pdf-template-schema

Phase 6 schema foundation for the Asym PDF Document Builder.

## Purpose

This package owns shared document template types, runtime schema, versioning
primitives, variable domains, page settings, asset references, render metadata,
batch metadata, and audit-oriented model types.

## Public API Promise

The public API is the shared schema contract for later editor, renderer,
DocRaptor, batch, and core-adapter phases. Runtime schemas and inferred
TypeScript types are exported together:

- `pdfTemplateSchemaBoundary`
- `PdfTemplateSchemaBoundary`
- `DocumentTemplateV1Schema` / `DocumentTemplateV1`
- `DocumentPageSettingsSchema` / `DocumentPageSettings`
- `DocumentThemeSchema` / `DocumentTheme`
- `VariableDefinitionSchema` / `VariableDefinition`
- `VariableReferenceSchema` / `VariableReference`
- `DataBindingSchema` / `DataBinding`
- `ConditionalRuleSchema` / `ConditionalRule`
- `RepeaterBindingSchema` / `RepeaterBinding`
- `TableBindingSchema` / `TableBinding`
- `AssetReferenceSchema` / `AssetReference`
- `RenderRequestSchema` / `RenderRequest`
- `RenderResultSchema` / `RenderResult`
- `RenderWarningSchema` / `RenderWarning`
- `RenderErrorSchema` / `RenderError`
- `RenderJobV1Schema` / `RenderJobV1`
- `BatchRunV1Schema` / `BatchRunV1`
- `DocumentArtifactSchema` / `DocumentArtifact`
- `AuditEventSchema` / `AuditEvent`

Zod is the runtime validation library for Phase 6 because it is already in the
workspace catalog and supports TypeScript inference plus future JSON Schema
conversion.

## Non-goals

- No PDF editor UI.
- No DocRaptor API calls.
- No browser-only APIs.
- No tenant storage, auth, or queue integration.
- No print HTML serialization.
- No starter template exports; Phase 24 owns starter templates and golden
  fixtures.

## Maturity

`phase-6-schema-foundation`. The package is private to prevent accidental
publication while the shared model is still evolving.

## Development

```sh
pnpm --filter @asym/pdf-template-schema build
pnpm --filter @asym/pdf-template-schema typecheck
pnpm --filter @asym/pdf-template-schema test
```

Later `Asymmetric-al/core` support may add Bun or different task runners, but
this fork follows the current pnpm, Turbo, TypeScript, Vitest, and tsdown
toolchain first.
