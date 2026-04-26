# Package Boundaries

Phase 3 creates the first `@asym/*` package shells while preserving the
current `@react-email/editor` package as the working reference implementation.
These packages define ownership and dependency direction only; they do not
implement PDF rendering, DocRaptor calls, or a new editor shell yet.

## Package Ownership

| Package | Runtime | Owns | Current maturity |
|---|---|---|---|
| `@asym/pdf-template-schema` | shared | Template schema, document domain types, variables, page settings, assets, render metadata, batch metadata, and audit-oriented model types | `phase-3-boundary` |
| `@asym/pdf-renderer` | server or build time | Future deterministic print HTML, paged-media CSS, preflight, renderer fixtures, and local preview helpers | `phase-3-boundary` |
| `@asym/docraptor-client` | server only | Future DocRaptor API client, sync and async render calls, status polling, test mode, and error normalization | `phase-3-boundary` |
| `@asym/pdf-editor` | browser React | Future PDF editor shell, TipTap extensions, document UI, slash commands, inspector controls, and compatibility shims | `phase-3-boundary` |
| `@asym/pdf-studio-adapter` | future app adapter | Future `Asymmetric-al/core` integration boundary for storage, permissions, assets, audit, feature flags, and render jobs | not created in Phase 3 |

All Phase 3 packages are marked `private: true` to prevent accidental
publication before release policy and production APIs are defined.

## Dependency Direction

Allowed dependency direction for Phase 3 and later package-boundary work:

```text
@asym/pdf-template-schema
  <- @asym/pdf-renderer
  <- @asym/docraptor-client, only when DocRaptor request types need schema data
  <- @asym/pdf-editor
  <- future @asym/pdf-studio-adapter
```

Current Phase 3 edges:

| From | To | Reason |
|---|---|---|
| `@asym/pdf-renderer` | `@asym/pdf-template-schema` | Renderer output must eventually validate and serialize structured document JSON. |
| `@asym/pdf-editor` | `@asym/pdf-template-schema` | Editor state must eventually write the shared template schema. |
| `@asym/pdf-editor` | `@react-email/editor` | Temporary reference adapter while the email editor remains the known-working implementation. |

Rejected directions:

- `@asym/pdf-template-schema` must not import React, editor UI, renderer code,
  DocRaptor code, tenant storage, auth, queues, or app routes.
- `@asym/pdf-renderer` must not import React editor UI or core app internals.
- `@asym/docraptor-client` must not be imported by browser packages.
- `@asym/pdf-editor` must not read DocRaptor credentials or server-only
  secrets.
- Future `@asym/pdf-studio-adapter` depends outward on package APIs and app
  adapters; package code must not import `Asymmetric-al/core` internals.

## Public Entry Points

Each package exposes one small typed boundary export from its root entry point:

| Package | Root boundary export |
|---|---|
| `@asym/pdf-template-schema` | `pdfTemplateSchemaBoundary`, `PdfTemplateSchemaBoundary` |
| `@asym/pdf-renderer` | `pdfRendererBoundary`, `PdfRendererBoundary` |
| `@asym/docraptor-client` | `docraptorClientBoundary`, `DocRaptorClientBoundary` |
| `@asym/pdf-editor` | `pdfEditorBoundary`, `PdfEditorBoundary` |

`@asym/pdf-editor/react-email-compat` exposes temporary reference adapters for
public `@react-email/editor` primitives:

- `ReactEmailEditorReference`
- `ReactEmailNodeReference`
- `ReactEmailMarkReference`
- `composeReactEmailReference`
- `ReactEmailStarterKitReference`
- `ReactEmailThemingReference`
- `ReactEmailBubbleMenuReference`
- `ReactEmailInspectorReference`
- `ReactEmailSlashCommandReference`

These names intentionally include `Reference` so callers do not confuse them
with final PDF-first APIs.

## Build And Test Shape

All new packages follow the current repo toolchain:

- `pnpm` workspace package discovery through `packages/*`.
- `tsdown` build output with ESM import exports first and CJS compatibility.
- `tsc --noEmit` type checks.
- `vitest` package tests.
- `biome check .` package lint scripts.
- React 18 and React 19 peer compatibility for `@asym/pdf-editor`.

Later `Asymmetric-al/core` integration may add Bun or different task runners,
but this repo stays on pnpm, Turbo, TypeScript, Vitest, Biome, and tsdown until
an OpenSpec change decides otherwise.

## Email Docs And Examples

Phase 3 does not delete or rename upstream email-oriented docs and examples.
They remain reference material until the phases that own package behavior and
documentation replacements exist.

Retained reference surfaces:

- `apps/docs/editor/**`
- `apps/demo`
- `apps/web`
- `playground`
- `packages/create-email`
- `packages/ui`
- `examples/*`

These surfaces remain classified as `replace-later`. Email sending/provider
examples are not part of the PDF builder product path. Phase 34 owns broad
documentation and examples replacement. Earlier feature phases may add focused
PDF examples only when the matching package behavior exists.

## Phase 4 Boundary Status

Phase 4 adds an internal boundary around the current React Email editor
surface without adding public package exports. The boundary lives at
`packages/editor/src/boundary` and records selected legacy root, core,
extension, plugin, UI, utility, CSS, and theme surfaces for future wrappers.

The baseline fixture scaffolding lives under:

- `packages/pdf-editor/test/fixtures`
- `packages/pdf-renderer/test/fixtures`

These fixtures are plain test data. They are not package APIs.

## Phase 5 Package Strategy Status

Phase 5 chooses the wrapper-first migration path. `@react-email/editor` remains
the working legacy package and `@asym/pdf-editor` remains the private future
PDF editor package that consumes it through public exports.

Active package migration rules:

- Do not rename `packages/editor` or change `@react-email/editor` exports.
- Do not force consumers to migrate during the compatibility window.
- New PDF-first work should target `@asym/*` package names.
- Keep `@asym/pdf-editor/react-email-compat` as the temporary React Email
  bridge until later phases add document-native APIs beside it.
- Keep all `@asym/*` packages private until release policy and stable public
  APIs exist.
- Do not add changesets for private boundary-only changes.

See `docs/package-strategy.md` for the full compatibility policy.

## Phase 6 Schema Status

Phase 6 creates the PDF template schema foundation inside
`@asym/pdf-template-schema` while preserving the editor boundary created in
Phase 4 and the package strategy defined in Phase 5. The new package names
remain available for fixture imports:

- `@asym/pdf-editor`
- `@asym/pdf-renderer`
- `@asym/pdf-template-schema`
- `@asym/docraptor-client`

Phase 6 should use Zod by default for runtime schema validation unless it
documents a measured reason to introduce Valibot. The package now exports
Zod-backed template, variable, binding, render, batch, artifact, and audit
schemas while staying private and free of React UI, DocRaptor calls, browser
APIs, storage, auth, and queue dependencies.

## Phase 8 Naming Compatibility Status

Phase 8 adds future-facing document/PDF names to the root `@asym/pdf-editor`
entry point while preserving the React Email compatibility adapter and all
current `@react-email/editor` exports:

- `PdfEditor`, `PdfEditorProps`, and `PdfEditorRef`
- `DocumentEditor`, `DocumentEditorProps`, and `DocumentEditorRef`
- `DocumentNode`
- `DocumentMark`

These are aliases only. They do not add a PDF serializer, PDF theming system,
new CSS export, or document-native editor shell. Phase 9 owns the print/PDF
serializer foundation.
