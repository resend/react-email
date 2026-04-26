# Phase 7 Completion Notes

Status: complete.

## Scope Completed

- Added internal compatibility fixtures for the current `@react-email/editor`
  behavior under `packages/editor/src/compatibility`.
- Covered simple paragraph, heading plus paragraph, link, image, button,
  two-column layout, table, themed document, and the docs' custom Callout
  extension example.
- Added a focused compatibility harness that asserts editor JSON shape,
  `composeReactEmail` HTML/text behavior, custom extension registration,
  public export groups, and CSS/theme export metadata.
- Preserved current serializer output, editor exports, package exports,
  extension renderers, and CSS files.
- Updated OpenSpec tasks and the mirrored roadmap so Phase 7 is complete and
  Phase 8 is next.
- Corrected `docs/public-export-map.md` to reflect that `createImageExtension`
  is an internal image helper, not a public `@react-email/editor/plugins`
  export today.

## Machine Details

- Date: 2026-04-26
- OS: Microsoft Windows NT 10.0.26200.0
- Node: `v24.11.1`
- pnpm: `10.33.0`
- Working branch: `codex/phase-07-editor-compatibility-harness`
- Base commit: `f1ae1c15`

## Focused Harness Development Notes

### Initial focused harness run

Command:

```text
pnpm --filter @react-email/editor exec vitest run --project unit src/compatibility/compatibility-harness.spec.tsx
```

Result: failed as expected while wiring the new harness.

Key output:

```text
Test Files  1 failed (1)
Tests  no tests
TypeError: createImageExtension is not a function
```

Resolution: kept public exports unchanged and imported the image extension from
the current internal module for test fixtures.

### Second focused harness run

Command:

```text
pnpm --filter @react-email/editor exec vitest run --project unit src/compatibility/compatibility-harness.spec.tsx
```

Result: failed while locking current JSON normalization and plain-text output.

Key output:

```text
Test Files  1 failed (1)
Tests  4 failed | 6 passed (10)
```

Resolution: updated the harness to record current `StarterKit` container
wrapping, trailing paragraph insertion, and uppercase heading plain text.

### Final focused harness run

Command:

```text
pnpm --filter @react-email/editor exec vitest run --project unit src/compatibility/compatibility-harness.spec.tsx
```

Result: passed.

Output:

```text
Test Files  1 passed (1)
Tests  10 passed (10)
Duration  4.20s
```

## Validation Results

### `pnpm --filter @react-email/editor test`

Result: passed.

Key output:

```text
> @react-email/editor@1.1.1 test C:\Users\Conrad\Documents\GitHub\react-PDF\packages\editor
> vitest run

Test Files  50 passed (50)
Tests  460 passed | 1 skipped (461)
Duration  10.51s
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

Build complete in 3131ms
Build complete in 3186ms

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

Checked 1166 files in 441ms. No fixes applied.
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
change/build-pdf-document-builder passed
Totals: 1 passed, 0 failed (1 items)
- Validating...
```

## Skipped Or Failed Checks

No required Phase 7 validation command was skipped.

The early focused harness failures were expected during test-first fixture
wiring and were resolved before final validation.

## Decisions And Tradeoffs Added

- Recorded that the compatibility harness preserves current email-era output
  rather than normalizing it into PDF-first behavior.
- Recorded that `createImageExtension` remains internal for Phase 7; the public
  plugin subpath still exposes `useEditorImage`.

## Update Log And Revert Guidance

### `packages/editor/src/compatibility/fixtures.tsx`

Changed: added deterministic compatibility fixture data and the docs-derived
custom Callout extension.

Revert: delete this file and remove imports from
`compatibility-harness.spec.tsx`.

### `packages/editor/src/compatibility/test-helpers.ts`

Changed: added shared editor creation, global-content helper, cleanup helper,
and ordered HTML assertion helper.

Revert: delete this file and inline or remove the helper usage from the Phase 7
harness.

### `packages/editor/src/compatibility/compatibility-harness.spec.tsx`

Changed: added the focused regression harness for JSON shape, current HTML/text
serialization, custom extension registration, public source export groups, and
CSS/theme export metadata.

Revert: delete this file. This removes the Phase 7 regression coverage but does
not affect runtime package exports.

### `docs/public-export-map.md`

Changed: corrected the plugin export map so `createImageExtension` is
documented as internal, matching current package behavior and export smoke
coverage.

Revert: restore the previous plugin runtime export list if a later phase
actually makes `createImageExtension` public.

### `docs/decision-log.md`

Changed: added Phase 7 decisions for preserving current editor output and
keeping the image extension helper internal.

Revert: remove the two Phase 7 decision entries.

### `docs/roadmap.md`

Changed: marked Phase 7 complete and Phase 8 next.

Revert: set Phase 7 back to `Next`, Phase 8 back to `Not started`, and restore
the Phase 7 entry-point text.

### `openspec/changes/build-pdf-document-builder/tasks.md`

Changed: marked Phase 7 tasks, validation, and handoff complete; set Phase 8
as next.

Revert: uncheck the Phase 7 task/validation/handoff boxes and restore the
status table.

### `docs/phase-7-completion-notes.md`

Changed: added these completion notes.

Revert: delete this file.

## Remaining Risks

- The harness records current email-first behavior, including container
  wrapping, trailing paragraph insertion, uppercase heading plain text, React
  Email table output, and email theming styles. Phase 8 and Phase 9 must update
  fixtures intentionally if behavior changes.
- The harness uses an internal image extension helper only for fixture setup.
  Future public media APIs remain Phase 22 work.
- Browser/editor integration behavior remains covered by the existing editor
  browser tests; Phase 7 did not add new browser-only tests.

## Phase 8 Handoff

Phase 8 can start from:

- `packages/editor/src/compatibility`
- `docs/phase-7-completion-notes.md`
- `docs/public-export-map.md`
- `docs/editor-package-isolation.md`
- `docs/package-strategy.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`

Next phase goal: introduce document/PDF-first names as compatibility aliases or
wrappers without breaking current email-first imports or the Phase 7 harness.
