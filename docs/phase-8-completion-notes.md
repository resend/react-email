# Phase 08 Completion Notes

Status: complete.

## Phase 08 Scope Completed

- Added Phase 08 document/PDF-first aliases to the private
  `@asym/pdf-editor` root entry point.
- Preserved all existing `@react-email/editor` exports and the
  `@asym/pdf-editor/react-email-compat` reference adapter.
- Added Phase 08 compatibility tests proving old imports still work, new
  imports work, alias types match, and aliases reuse the same runtime values.
- Added a Phase 08 post-build smoke command that verifies built exports and
  generated declarations.
- Updated Phase 08 docs, OpenSpec tasks, and roadmap handoff notes so Phase 09
  is the next implementation phase.

## Machine Details

- Date: 2026-04-26
- OS: Microsoft Windows NT 10.0.26200.0
- Node: `v24.11.1`
- pnpm: `10.33.0`
- Working branch: `codex/phase-08-safe-document-names`
- Starting commit: `e08d6246`

## Phase 08 Compatibility Decisions

- `PdfEditor`, `PdfEditorProps`, and `PdfEditorRef` were added as the
  recommended future import names because the package is `@asym/pdf-editor`.
- `DocumentEditor`, `DocumentEditorProps`, and `DocumentEditorRef` were added
  beside `PdfEditor` for document-domain code that should avoid coupling to the
  PDF file format name.
- `DocumentNode` and `DocumentMark` were added as exact aliases of the current
  `EmailNode` and `EmailMark` classes. They still use current
  `renderToReactEmail` semantics until Phase 09 introduces a real print/PDF
  serializer.
- `composeReactEmail` was not given a document/PDF alias in Phase 08 because a
  document-named serializer must not imply print/PDF output before Phase 09.
- `DocumentTheming` was deferred because current `EmailTheming` still carries
  email-specific reset/default behavior; Phase 23 owns PDF-specific branding
  and theme semantics.
- No `@react-email/editor` package exports, CSS/theme exports, serializer
  output, or UI exports changed in Phase 08.

## Test-First Notes

### Phase 07 harness before Phase 08 edits

Command:

```text
pnpm --filter @react-email/editor exec vitest run --project unit src/compatibility/compatibility-harness.spec.tsx
```

Result: passed before Phase 08 edits.

Output:

```text
Test Files  1 passed (1)
Tests  10 passed (10)
Duration  7.35s
```

### Initial Phase 08 focused test

Command:

```text
pnpm --filter @asym/pdf-editor exec vitest run test/document-naming-compatibility.spec.tsx
```

Result: failed as expected before aliases existed.

Key output:

```text
Test Files  1 failed (1)
Tests  2 failed | 2 passed (4)
AssertionError: expected undefined to be ReactEmailEditorReference
AssertionError: expected undefined to be ReactEmailNodeReference
```

Resolution: added root `@asym/pdf-editor` aliases for `PdfEditor`,
`DocumentEditor`, `DocumentNode`, and `DocumentMark`.

## Final Phase 08 Validation Results

### `pnpm --filter @react-email/editor exec vitest run --project unit src/compatibility/compatibility-harness.spec.tsx`

Result: passed.

Output:

```text
Test Files  1 passed (1)
Tests  10 passed (10)
Duration  7.12s
```

### `pnpm --filter @asym/pdf-editor exec vitest run test/document-naming-compatibility.spec.tsx`

Result: passed.

Output:

```text
Test Files  1 passed (1)
Tests  4 passed (4)
Duration  3.26s
```

### `pnpm --filter @asym/pdf-editor test`

Result: passed.

Output:

```text
> @asym/pdf-editor@0.0.0 test C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-editor
> vitest run

Test Files  3 passed (3)
Tests  9 passed (9)
Duration  3.76s
```

### `pnpm --filter @asym/pdf-editor typecheck`

Result: passed.

Output:

```text
> @asym/pdf-editor@0.0.0 typecheck C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-editor
> tsc --noEmit
```

### `pnpm --filter @asym/pdf-editor build`

Result: passed.

Key output:

```text
> @asym/pdf-editor@0.0.0 build C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-editor
> tsdown

[CJS] dist\index.cjs               2.74 kB
[CJS] dist\react-email-compat.cjs  1.82 kB
[CJS] dist\index.d.cts             2.10 kB
[ESM] dist\index.mjs               1.16 kB
[ESM] dist\react-email-compat.mjs  0.88 kB
[ESM] dist\index.d.mts             2.10 kB
Build complete in 2507ms
Build complete in 2521ms
```

### `pnpm asym:phase-08-document-names-smoke`

Result: passed.

Output:

```text
> react-email-monorepo@0.0.0 asym:phase-08-document-names-smoke C:\Users\Conrad\Documents\GitHub\react-PDF
> tsx scripts/asym-phase-08-document-names-smoke.ts

asym-phase-08-document-names-smoke
verified Phase 08 aliases=DocumentEditor,DocumentEditorProps,DocumentEditorRef,DocumentMark,DocumentNode,PdfEditor,PdfEditorProps,PdfEditorRef
status=ok
```

### `pnpm --filter @react-email/editor test`

Result: passed.

Key output:

```text
> @react-email/editor@1.1.1 test C:\Users\Conrad\Documents\GitHub\react-PDF\packages\editor
> vitest run

Test Files  50 passed (50)
Tests  460 passed | 1 skipped (461)
Duration  14.70s
```

Observed warning: Vite still reports the existing dynamic Prism language import
warning in `packages/editor/src/extensions/prism-plugin.ts`.

### `pnpm --filter @react-email/editor typecheck`

Result: passed.

Output:

```text
> @react-email/editor@1.1.1 typecheck C:\Users\Conrad\Documents\GitHub\react-PDF\packages\editor
> tsc --noEmit
```

### `pnpm --filter @react-email/editor build`

Result: passed.

Key output:

```text
> @react-email/editor@1.1.1 build C:\Users\Conrad\Documents\GitHub\react-PDF\packages\editor
> tsdown

Build complete in 4993ms
Build complete in 5084ms

> @react-email/editor@1.1.1 build:css C:\Users\Conrad\Documents\GitHub\react-PDF\packages\editor
> tsx scripts/copy-css.ts

copied ui/bubble-menu/bubble-menu.css
copied ui/button-bubble-menu/button-bubble-menu.css
copied ui/image-bubble-menu/image-bubble-menu.css
copied ui/inspector/inspector.css
copied ui/link-bubble-menu/link-bubble-menu.css
copied ui/slash-command/slash-command.css
processed ui\themes\default.css
```

Observed warnings: existing `MODULE_TYPELESS_PACKAGE_JSON`,
`rolldown-plugin-dts` relative module declaration, and tsdown plugin timing
warnings.

### `pnpm asym:editor-export-smoke`

Result: passed.

Output:

```text
asym-editor-export-smoke
imported @react-email/editor exports=EmailEditor
imported @react-email/editor/core exports=EmailMark,EmailNode,composeReactEmail,editorEventBus,isDocumentVisuallyEmpty
imported @react-email/editor/extensions exports=Body,Bold,Button,Container,Heading,Link,Paragraph,Section,StarterKit,Table,Text
imported @react-email/editor/plugins exports=EmailTheming,useEditorImage
imported @react-email/editor/ui exports=BubbleMenu,Inspector,SlashCommand
imported @react-email/editor/utils exports=setTextAlignment
resolved @react-email/editor/styles/bubble-menu.css
resolved @react-email/editor/styles/button-bubble-menu.css
resolved @react-email/editor/styles/image-bubble-menu.css
resolved @react-email/editor/styles/inspector.css
resolved @react-email/editor/styles/link-bubble-menu.css
resolved @react-email/editor/styles/slash-command.css
resolved @react-email/editor/themes/default.css
status=ok
```

### `pnpm lint`

Result: passed with the known existing warning.

Output:

```text
> react-email-monorepo@0.0.0 lint C:\Users\Conrad\Documents\GitHub\react-PDF
> biome check

Checked 1168 files in 714ms. No fixes applied.
Found 1 warning.
apps\web\src\app\editor\editor-overrides.css:7:21 lint/complexity/noImportantStyles
```

The `!important` warning is pre-existing and non-blocking.

### `pnpm dlx @fission-ai/openspec@latest validate build-pdf-document-builder`

Result: passed.

Output:

```text
Change 'build-pdf-document-builder' is valid
```

### `pnpm dlx @fission-ai/openspec@latest validate --all`

Result: passed.

Output:

```text
✓ change/build-pdf-document-builder
Totals: 1 passed, 0 failed (1 items)
- Validating...
```

## Skipped Or Failed Checks

No required Phase 08 validation command was skipped.

An initial `pnpm lint` run failed only on new-file formatting/import order and
the known CSS warning. The touched Phase 08 files were formatted with:

```text
pnpm exec biome check --write package.json packages/pdf-editor/src/index.ts packages/pdf-editor/test/document-naming-compatibility.spec.tsx scripts/asym-phase-08-document-names-smoke.ts
```

The final `pnpm lint` run passed with only the known CSS warning.

## Update Log And Revert Guidance

### `packages/pdf-editor/src/index.ts`

Changed: added Phase 08 root aliases for `PdfEditor`, `DocumentEditor`,
`DocumentNode`, `DocumentMark`, and their editor prop/ref types.

Revert: remove the Phase 08 alias export blocks from this file. Existing
`pdfEditorBoundary` and `react-email-compat` exports can remain unchanged.

### `packages/pdf-editor/test/document-naming-compatibility.spec.tsx`

Changed: added Phase 08 tests for old reference imports, new document/PDF
imports, type equivalence, and runtime alias identity.

Revert: delete this file if Phase 08 aliases are removed.

### `scripts/asym-phase-08-document-names-smoke.ts`

Changed: added a Phase 08 post-build smoke script that imports the built
`@asym/pdf-editor` root entry, checks alias identity, and verifies generated
declaration files mention the new names.

Revert: delete this file and remove the root package script.

### `package.json`

Changed: added `asym:phase-08-document-names-smoke`.

Revert: remove that script entry.

### Documentation And OpenSpec Files

Changed: updated `docs/package-strategy.md`, `docs/term-migration-map.md`,
`docs/package-boundaries.md`, `docs/decision-log.md`, `docs/roadmap.md`,
`packages/pdf-editor/readme.md`,
`openspec/changes/build-pdf-document-builder/design.md`, and
`openspec/changes/build-pdf-document-builder/tasks.md` to document Phase 08
aliases, deferred serializer/theming decisions, and Phase 09 handoff.

Revert: remove the Phase 08 alias decision sections, set Phase 08 back to
`Next` in roadmap/task trackers, and restore Phase 8 handoff wording.

## Remaining Risks

- Phase 08 document/PDF names still point at email-era runtime behavior.
- `DocumentNode` and `DocumentMark` still expose `renderToReactEmail` in their
  config type. Phase 09 must introduce a separate print/PDF serializer rather
  than masking `composeReactEmail`.
- The root `@asym/pdf-editor` package remains private, so these names are
  workspace-facing compatibility targets, not publish-ready public APIs.

## Phase 09 Handoff

Phase 09 is ready to begin from:

- `packages/pdf-editor/src/index.ts`
- `packages/pdf-editor/test/document-naming-compatibility.spec.tsx`
- `packages/editor/src/compatibility`
- `docs/phase-8-completion-notes.md`
- `docs/package-strategy.md`
- `docs/term-migration-map.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`

Next phase goal: build a document serializer foundation separate from
`composeReactEmail` without breaking Phase 07 compatibility fixtures or Phase
08 naming aliases.
