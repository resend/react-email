# Phase 09 Completion Notes

Status: complete.

## Phase 09 Scope Completed

- Added `composePdfDocumentHtml` to `@asym/pdf-renderer` as a document/PDF
  serializer foundation separate from `composeReactEmail`.
- Added structured Phase 09 output for HTML, CSS requirements, render
  warnings, asset references, and variable usage.
- Added built-in Phase 09 renderers for structured document nodes covering
  paragraphs, headings, links, images, buttons, columns, tables, and explicit
  variable nodes.
- Added extension-style Phase 09 node and mark renderer registration for
  package-local custom renderers.
- Preserved the React Email editor serializer, editor package exports,
  DocRaptor package boundary, and current compatibility harness.
- Updated OpenSpec tasks and the mirrored roadmap so Phase 09 is complete and
  Phase 10 is next.

## Machine Details

- Date: 2026-04-26
- OS: Microsoft Windows NT 10.0.26200.0
- Node: `v24.11.1`
- pnpm: `10.33.0`
- Working branch: `codex/phase-09-document-serializer`

## Phase 09 Implementation Notes

- `composePdfDocumentHtml` walks structured document JSON recursively instead
  of performing string replacement.
- Unknown container nodes render their children with a structured warning.
- Unknown leaf nodes are omitted with a structured warning.
- Variable usage is collected only from explicit `variable` or
  `variableReference` nodes. Raw merge-tag text remains text in Phase 09.
- Serializer-level CSS requirements are foundational only. Phase 10 owns the
  full print shell, page settings, `@page` CSS, margins, and print media model.
- No DocRaptor client, API key, request payload, or render mode behavior was
  introduced in Phase 09.

## Validation Results

### `pnpm --filter @react-email/editor exec vitest run --project unit src/compatibility/compatibility-harness.spec.tsx`

Result: passed before Phase 09 serializer edits.

Output:

```text
Test Files  1 passed (1)
Tests  10 passed (10)
Duration  7.08s
```

### Initial `pnpm --filter @asym/pdf-renderer test`

Result: failed while tightening attribute serialization.

Key output:

```text
Test Files  1 failed | 2 passed (3)
Tests  2 failed | 15 passed (17)
AssertionError: expected '<h2 level="2">Quarterly Update</h2>' to be '<h2>Quarterly Update</h2>'
AssertionError: expected '<p alignment="right" style="color:#11...' to be '<p style="color:#111827;text-align:ri...'
```

Resolution: excluded semantic serializer attributes such as `level` and
`alignment` from generic HTML attribute pass-through after using them to drive
output.

### `pnpm --filter @asym/pdf-renderer test`

Result: passed.

Output:

```text
Test Files  3 passed (3)
Tests  18 passed (18)
Duration  645ms (transform 270ms, setup 0ms, import 475ms, tests 46ms, environment 1ms)
```

### `pnpm --filter @asym/pdf-renderer typecheck`

Result: passed.

Output:

```text
> @asym/pdf-renderer@0.0.0 typecheck C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-renderer
> tsc --noEmit
```

### `pnpm --filter @asym/pdf-renderer build`

Result: passed.

Key output:

```text
> @asym/pdf-renderer@0.0.0 build C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-renderer
> tsdown

[CJS] dist\index.cjs  17.87 kB
[ESM] dist\index.mjs  17.78 kB
Build complete in 1590ms
Build complete in 1596ms
```

## Final Phase 09 Validation Results

### `pnpm --filter @react-email/editor test`

Result: passed.

Key output:

```text
Test Files  50 passed (50)
Tests  460 passed | 1 skipped (461)
Duration  19.39s
```

Observed warning: Vite still reports the existing dynamic Prism language import
warning in `packages/editor/src/extensions/prism-plugin.ts`.

### `pnpm test`

Result: passed.

Key output:

```text
Tasks:    15 successful, 15 total
Cached:    14 cached, 15 total
Time:    2.201s
```

Observed warnings: existing Vitest mock-hoisting warnings in `@react-email/render`,
existing Vite dynamic import warnings, existing React key warnings in editor
serializer tests, and skipped upstream tests remained non-blocking.

### `pnpm build`

Result: failed for the known upstream Windows demo/playground symlink issue
after targeted Phase 09 package builds passed.

First attempt note: an initial `pnpm build` was run in parallel with
`pnpm test` and failed because `@react-email/ui` saw another Next build
process. The command was rerun sequentially.

Sequential key output:

```text
@asym/pdf-renderer:build:
> @asym/pdf-renderer@0.0.0 build C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-renderer
> tsdown

[CJS] dist\index.cjs  17.78 kB
[ESM] dist\index.mjs  17.69 kB
Build complete in 2402ms
Build complete in 2412ms

demo:build: Error: EPERM: operation not permitted, symlink 'C:\Users\Conrad\Documents\GitHub\react-PDF\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core' -> 'C:\Users\Conrad\Documents\GitHub\react-PDF\apps\demo\.react-email\node_modules\@babel\core'
playground:build: Error: EPERM: operation not permitted, symlink 'C:\Users\Conrad\Documents\GitHub\react-PDF\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core' -> 'C:\Users\Conrad\Documents\GitHub\react-PDF\playground\.react-email\node_modules\@babel\core'

Tasks:    8 successful, 11 total
Failed:    demo#build
```

This is the same Windows upstream demo/playground symlink caveat documented in
earlier phase notes. The ignored generated `.react-email` directories left by
the failed build were removed after verifying their paths resolved inside the
workspace.

### `pnpm lint`

Result: passed with the known existing warning.

Output:

```text
Checked 1170 files in 618ms. No fixes applied.
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

No required Phase 09 validation command was skipped.

`pnpm build` remains blocked by the known Windows upstream demo/playground
symlink behavior. The Phase 09 package build, typecheck, focused tests, editor
tests, full workspace tests, lint, and OpenSpec validation passed.

## Update Log And Revert Guidance

### `packages/pdf-renderer/src/compose-pdf-document-html.ts`

Changed: added the Phase 09 structured document serializer, output types,
renderer registration types, built-in node/mark renderers, deterministic HTML
helpers, warning collection, asset collection, and variable usage collection.

Revert: delete this file and remove its exports from
`packages/pdf-renderer/src/index.ts`.

### `packages/pdf-renderer/src/index.ts`

Changed: exported the Phase 09 serializer API and updated
`pdfRendererBoundary.maturity` to `phase-09-serializer-foundation`.

Revert: remove the serializer exports and restore maturity to
`phase-3-boundary` if the serializer file is removed.

### `packages/pdf-renderer/test/compose-pdf-document-html.spec.ts`

Changed: added Phase 09 tests for supported nodes, unknown nodes and marks,
style merge order, empty documents, invalid input, variable usage, assets, and
custom renderer registration.

Revert: delete this file if the Phase 09 serializer is removed.

### `packages/pdf-renderer/test/public-entry.spec.ts`

Changed: updated boundary maturity expectations and added public serializer
export coverage.

Revert: restore the old maturity expectation and remove serializer assertions
if Phase 09 is reverted.

### `packages/pdf-renderer/readme.md`

Changed: replaced the Phase 3 shell README with Phase 09 serializer API docs,
output shape notes, non-goals, and DocRaptor deferral.

Revert: restore the previous Phase 3 shell README text if the serializer API is
removed.

### Documentation And OpenSpec Files

Changed: updated `docs/decision-log.md`, `docs/roadmap.md`, and
`openspec/changes/build-pdf-document-builder/tasks.md` to record the Phase 09
serializer decision, mark Phase 09 complete, and mark Phase 10 next.

Revert: remove the Phase 09 decision entry, set Phase 09 back to `Next`, set
Phase 10 back to `Not started`, and uncheck the Phase 09 task and validation
items.

## Remaining Risks

- Phase 09 emits serializer-level HTML fragments only. Page setup, full print
  shell CSS, margins, `@page`, and page counters remain Phase 10 work.
- Phase 09 variable usage is collection-only. Real variable registry,
  resolution, formatting, fallback, and validation remain later phases.
- Phase 09 image handling records asset references but does not preflight
  reachability or reject blob/private URLs; Phase 22 and Phase 25 own those
  checks.
- The package remains private and not publish-ready.

## Phase 10 Handoff

Phase 10 can start from:

- `packages/pdf-renderer/src/compose-pdf-document-html.ts`
- `packages/pdf-renderer/test/compose-pdf-document-html.spec.ts`
- `packages/pdf-renderer/readme.md`
- `packages/pdf-template-schema/src/template.ts`
- `docs/phase-9-completion-notes.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`

Next phase goal: wrap Phase 09 serializer output in a deterministic print HTML
shell with schema-driven page settings and print CSS, without calling
DocRaptor.
