# Package Strategy

Phase 5 defines how this fork moves from React Email package names to
PDF-first package names without a big-bang rename. This is a compatibility
policy phase. It does not implement schema, renderer, editor shell, or
DocRaptor behavior.

## Chosen Strategy

The near-term package path is wrapper-first:

1. Keep `packages/editor` publishing as `@react-email/editor`.
2. Keep `packages/pdf-editor` as private `@asym/pdf-editor`.
3. Treat `@asym/pdf-editor` as the future PDF editor import target.
4. Keep `@asym/pdf-editor/react-email-compat` as the temporary bridge to the
   current editor.
5. Move behavior into PDF-first packages only after fixtures and serializer
   contracts exist.

This is the least risky path because existing editor exports continue to build
and future code can start importing the `@asym/*` package names without moving
or renaming the working editor implementation.

## Current Package Names

| Current package | Status | Phase 5 policy |
|---|---|---|
| `@react-email/editor` | Working legacy editor baseline | Keep unchanged until a later compatibility-removal phase. |
| `@asym/pdf-editor` | Private wrapper boundary | Use as the stable future import target. |
| `@asym/pdf-template-schema` | Private schema boundary | Keep private; schema foundation starts in Phase 6. |
| `@asym/pdf-renderer` | Private renderer boundary | Keep private; renderer behavior starts after schema contracts. |
| `@asym/docraptor-client` | Private server-only boundary | Keep private; DocRaptor behavior starts in its rendering phase. |
| `react-email` and `@react-email/render` | Retained React Email runtime | Wrap or replace later after PDF serializer behavior exists. |

## Target Package Names

The long-term public package names are:

- `@asym/pdf-template-schema`
- `@asym/pdf-editor`
- `@asym/pdf-renderer`
- `@asym/docraptor-client`
- `@asym/pdf-studio-adapter`, created later when the core integration phase
  owns it

`@react-email/editor` remains a compatibility package during migration. It is
not the final import path for PDF builder consumers.

## Compatibility Exports

The current compatibility path is:

```ts
import { pdfEditorBoundary } from '@asym/pdf-editor';
import {
  ReactEmailEditorReference,
  composeReactEmailReference,
} from '@asym/pdf-editor/react-email-compat';
```

The `Reference` suffix is intentional. It signals that these names are
temporary React Email references, not final PDF editor APIs.

The following `@react-email/editor` exports remain stable during this phase:

- `@react-email/editor`
- `@react-email/editor/core`
- `@react-email/editor/extensions`
- `@react-email/editor/plugins`
- `@react-email/editor/ui`
- `@react-email/editor/utils`
- `@react-email/editor/styles/*.css`
- `@react-email/editor/themes/default.css`

Phase 5 does not add public exports to `@react-email/editor`.

## Long-Term Public API

Future PDF-first consumers should import from `@asym/*` packages:

```ts
import { pdfEditorBoundary } from '@asym/pdf-editor';
import { pdfTemplateSchemaBoundary } from '@asym/pdf-template-schema';
import { pdfRendererBoundary } from '@asym/pdf-renderer';
```

Later phases will replace boundary-only exports with real APIs such as PDF
template schemas, `PdfEditor`, PDF document nodes and marks, print HTML
serialization, preflight, and DocRaptor client calls. Those APIs must be added
beside compatibility exports before any legacy export is removed.

## Private Internals

These surfaces remain private until a later phase explicitly promotes them:

- `packages/editor/src/boundary`
- `packages/pdf-editor/test/fixtures`
- `packages/pdf-renderer/test/fixtures`
- Any direct source import from `packages/editor/src/**`
- Any DocRaptor credential or request-building implementation
- Future `Asymmetric-al/core` storage, auth, tenant, asset, queue, or audit
  adapters

PDF packages may depend on public package subpaths or explicit adapter
interfaces. They must not depend on private source paths from another package.

## How `@react-email/editor` Continues To Build

`@react-email/editor` remains the known-working editor baseline:

- Its package name, version, exports, serializer, styles, and tests remain
  unchanged in Phase 5.
- `composeReactEmail`, `EmailNode`, `EmailMark`, `EmailTheming`, and
  `EmailEditor` remain available under their current names.
- The `@asym/pdf-editor` wrapper consumes public `@react-email/editor` exports
  only.
- Export smoke checks continue to verify the legacy subpaths.

No consumer is forced to migrate in Phase 5.

## How Future `@asym/pdf-editor` Consumers Import APIs

New PDF builder code should prefer:

```ts
import { pdfEditorBoundary } from '@asym/pdf-editor';
```

During the compatibility window, code that needs the current editor reference
may import:

```ts
import { ReactEmailEditorReference } from '@asym/pdf-editor/react-email-compat';
```

Direct imports from `@react-email/editor` remain allowed for the legacy editor
baseline and tests, but new PDF-first features should introduce document names
under `@asym/pdf-editor` when their phase owns the behavior.

## Changesets And Releases

Phase 5 does not add a changeset.

Reasons:

- All `@asym/*` packages are private.
- No publishable runtime API changes are introduced.
- `@react-email/editor` public exports do not change.

When packages become publishable, release policy should require:

- A changeset for any public `@asym/*` API change.
- Compatibility notes for any `@react-email/editor` migration behavior.
- Explicit prerelease or canary handling before stable publication.
- Release notes that identify whether a change affects editor, schema,
  renderer, DocRaptor, or core adapter consumers.

## Future `Asymmetric-al/core` Consumption

`Asymmetric-al/core` should consume this repo through package APIs and adapter
interfaces, not private source paths.

Expected future direction:

- Core imports `@asym/pdf-editor` for the browser editor surface.
- Core imports `@asym/pdf-template-schema` for template JSON validation and
  persistence boundaries.
- Core imports server-safe renderer and DocRaptor packages only from server
  code.
- Core provides storage, auth, tenant, asset, queue, feature flag, and audit
  adapters in the later integration phase.

This keeps the PDF builder portable while preserving core's app boundaries and
data policies.

## Phase 6 Handoff

The next phase creates the PDF template schema foundation. It should fill
`@asym/pdf-template-schema` with the first real versioned template types and
runtime validation while preserving the package strategy defined here.

Phase 6 should use Zod by default because Zod is already present in the
workspace and supports runtime validation, TypeScript inference, and JSON
Schema conversion. Valibot can be reconsidered later only with a measured
bundle-size or runtime reason.
