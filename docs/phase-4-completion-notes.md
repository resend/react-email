# Phase 4 Completion Notes

Status: complete.

## Scope Completed

- Added `docs/editor-package-isolation.md` with the current editor exports,
  internal entry points, safe wrap points, must-not-touch files, current test
  coverage, future package split, and early-move risks.
- Added `packages/editor/src/boundary` as an internal-only legacy React Email
  editor boundary. It is not exported from `@react-email/editor`.
- Added boundary tests that assert selected current editor references and
  CSS/theme subpaths remain represented.
- Added deterministic Phase 4 fixture scaffolding under
  `packages/pdf-editor/test/fixtures` and
  `packages/pdf-renderer/test/fixtures`.
- Added `@asym/pdf-editor` and `@asym/pdf-renderer` fixture tests.
- Updated roadmap, package-boundary docs, decision log, and OpenSpec tasks so
  Phase 4 is complete and Phase 5 is next.
- Preserved `@react-email/editor` package exports and React Email serializer
  behavior.

## Machine Details

- Date: 2026-04-26
- OS: Microsoft Windows NT 10.0.26200.0
- Node: `v24.11.1`
- pnpm: `10.33.0`
- Working branch: `codex/phase-04-editor-boundary`
- Base commit: `147ee31e04f7163e391c156bd848fe78e7172b56`
- Readiness checkpoint commit: `24b74c4d`

## Validation Results

### `pnpm --filter @react-email/editor typecheck`

Result: passed.

Key output:

```text
> @react-email/editor@1.1.1 typecheck C:\Users\Conrad\Documents\GitHub\react-PDF\packages\editor
> tsc --noEmit
```

Implementation note: the first run exposed pre-existing typecheck gaps in
editor test/config files. The Phase 4 cleanup fixed those by tightening test
casts in `trailing-node.spec.ts` and `image/extension.spec.tsx`, and by passing
explicit empty option objects to the React and Playwright Vitest plugins.

### `pnpm --filter @react-email/editor test`

Result: passed.

Key output:

```text
> @react-email/editor@1.1.1 test C:\Users\Conrad\Documents\GitHub\react-PDF\packages\editor
> vitest run

Test Files  49 passed (49)
Tests  450 passed | 1 skipped (451)
Duration  12.03s
```

Observed warning: Vite still warns that the dynamic Prism language import in
`packages/editor/src/extensions/prism-plugin.ts` cannot be statically analyzed.
That warning is existing editor behavior and was not changed in Phase 4.

### `pnpm --filter @react-email/editor build`

Result: passed.

Key output:

```text
> @react-email/editor@1.1.1 build C:\Users\Conrad\Documents\GitHub\react-PDF\packages\editor
> tsdown

Build complete in 5940ms

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

Observed warnings: existing `MODULE_TYPELESS_PACKAGE_JSON`, relative dts module
declaration, and tsdown plugin timing warnings.

### `pnpm --filter @asym/pdf-editor test`

Result: passed.

Key output:

```text
> @asym/pdf-editor@0.0.0 test C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-editor
> vitest run

Test Files  2 passed (2)
Tests  4 passed (4)
Duration  2.39s
```

### `pnpm --filter @asym/pdf-renderer test`

Result: passed.

Key output:

```text
> @asym/pdf-renderer@0.0.0 test C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-renderer
> vitest run

Test Files  2 passed (2)
Tests  2 passed (2)
Duration  382ms
```

### `pnpm asym:editor-export-smoke`

Result: passed.

Key output:

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

Result: passed after formatting new/touched files.

Cleanup command:

```text
pnpm biome check --write packages/editor/src/boundary/index.ts packages/editor/src/boundary/index.spec.ts packages/editor/src/extensions/trailing-node.spec.ts packages/editor/src/plugins/image/extension.spec.tsx packages/editor/vitest.config.ts packages/pdf-editor/test/fixtures/legacy-editor-document.ts packages/pdf-editor/test/legacy-fixtures.spec.tsx packages/pdf-renderer/test/fixtures/legacy-render-expectations.ts packages/pdf-renderer/test/legacy-render-fixtures.spec.ts
```

Final key output:

```text
> react-email-monorepo@0.0.0 lint C:\Users\Conrad\Documents\GitHub\react-PDF
> biome check

Checked 1154 files in 396ms. No fixes applied.
Found 1 warning.
apps\web\src\app\editor\editor-overrides.css:7:21 lint/complexity/noImportantStyles
```

The lint warning is the known existing warning and is non-blocking.

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
change/build-pdf-document-builder passed
Totals: 1 passed, 0 failed (1 items)
```

## Skipped Or Failed Checks

No required Phase 4 check was skipped.

The first `pnpm lint` run failed because new/touched files needed Biome
formatting. The listed targeted `pnpm biome check --write ...` command fixed
only those files, and the final `pnpm lint` run passed with the known existing
CSS warning.

## Decisions And Tradeoffs Added

- The legacy editor boundary is internal-only and is not a public package
  export.
- Phase 4 fixtures are plain test data, not public schema or renderer APIs.
- The React Email serializer remains the baseline until later phases define
  PDF-first serializer contracts.

## Remaining Risks

- `@asym/pdf-editor` still references `@react-email/editor` through the
  temporary compatibility adapter.
- The Phase 4 fixtures are intentionally minimal and should be expanded when
  Phase 6 and Phase 9 define real schema and serializer behavior.
- Email-oriented apps, examples, and docs remain retained reference material
  until later phases own replacement.

## Phase 5 Handoff

Phase 5 can start from:

- `docs/editor-package-isolation.md`
- `docs/phase-4-completion-notes.md`
- `packages/editor/src/boundary`
- `packages/pdf-editor/test/fixtures`
- `packages/pdf-renderer/test/fixtures`
- `packages/pdf-template-schema`

Next phase goal: define package names, export strategy, and compatibility
policy without breaking the editor boundary.
