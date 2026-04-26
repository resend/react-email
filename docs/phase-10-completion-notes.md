# Phase 10 Completion Notes

Status: complete.

## Phase 10 Scope Completed

- Added `composePrintDocumentHtml` to `@asym/pdf-renderer` as the Phase 10
  print HTML shell around Phase 9 serializer output.
- Added schema-driven page settings using `DocumentPageSettingsSchema`.
- Added deterministic full HTML output with escaped document titles, a single
  style block, and a print document `<main>`.
- Added deterministic print CSS for page size, orientation, margins, base CSS
  variables, page-break classes, keep-together classes, repeated table header
  CSS, and page-number placeholder classes.
- Kept DocRaptor integration out of Phase 10. No API key, client, request
  payload, test mode, production mode, or network behavior was added.
- Updated OpenSpec tasks and the mirrored roadmap so Phase 10 is complete and
  Phase 11 is next.

## Machine Details

- Date: 2026-04-26
- OS: Microsoft Windows NT 10.0.26200.0
- Node: `v24.11.1`
- pnpm: `10.33.0`
- Working branch: `codex/phase-10-print-shell`

## Phase 10 Implementation Notes

- `composePrintDocumentHtml` accepts a Phase 9
  `ComposePdfDocumentHtmlResult`, a required title, and optional
  `DocumentPageSettings`.
- Letter, A4, Legal, and custom page sizes resolve to deterministic CSS
  dimensions. Landscape orientation swaps width and height.
- Invalid page settings return a structured `invalid_page_settings` render
  warning and empty shell output instead of throwing.
- `result.css` is the combined style block used by the generated HTML.
  `result.cssRequirements` keeps Phase 9 serializer CSS and the Phase 10 shell
  CSS as separate requirements to avoid duplicate concatenation.
- Page number output is limited to placeholder classes using `counter(page)`
  and `counter(pages)`. Full header/footer integration remains Phase 21.
- Browser preview fidelity remains Phase 12. The Phase 10 shell only emits
  deterministic print HTML/CSS.

## DocRaptor Compatibility Notes

- DocRaptor and Prince support CSS paged media. Their docs identify the
  `@page` rule as the page box entry point for page size, orientation, and
  margins: https://docraptor.com/css-paged-media
- DocRaptor applies print media rules by default for PDF generation, and most
  PDF styling is controlled with CSS: https://docraptor.com/documentation/api/parameters
- DocRaptor margin docs note that page margins reserve page-region space for
  content such as headers or page numbers:
  https://docraptor.com/documentation/article/1067969-margins-bleed

## Validation Results

### TDD red: initial `pnpm --filter @asym/pdf-renderer test`

Result: failed before Phase 10 implementation because `composePrintDocumentHtml`
was not defined.

Key output:

```text
Test Files  2 failed | 2 passed (4)
Tests  10 failed | 20 passed (30)
TypeError: composePrintDocumentHtml is not a function
```

### `pnpm --filter @asym/pdf-renderer test`

Result: passed.

Output:

```text
Test Files  4 passed (4)
Tests  30 passed (30)
Duration  527ms (transform 436ms, setup 0ms, import 776ms, tests 43ms, environment 0ms)
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

[CJS] dist\index.cjs  22.22 kB
[ESM] dist\index.mjs  22.07 kB
[CJS] dist\index.cjs  22.31 kB
[ESM] dist\index.mjs  22.16 kB
Build complete in 1330ms
Build complete in 1340ms
```

## Final Phase 10 Validation Results

### `pnpm test`

Result: passed.

Key output:

```text
> react-email-monorepo@0.0.0 test C:\Users\Conrad\Documents\GitHub\react-PDF
> turbo run test

Tasks:    15 successful, 15 total
Cached:    14 cached, 15 total
Time:    1.831s
```

### `pnpm build`

Result: failed for the existing Windows upstream demo/playground symlink
caveat. The Phase 10 renderer build completed successfully inside the broader
run before the upstream app failures.

Key output:

```text
@asym/pdf-renderer:build:
@asym/pdf-renderer:build: > @asym/pdf-renderer@0.0.0 build C:\Users\Conrad\Documents\GitHub\react-PDF\packages\pdf-renderer
@asym/pdf-renderer:build: > tsdown
@asym/pdf-renderer:build:
@asym/pdf-renderer:build: [CJS] dist\index.cjs  22.31 kB │ gzip: 5.44 kB
@asym/pdf-renderer:build: [ESM] dist\index.mjs  22.16 kB │ gzip: 5.40 kB
@asym/pdf-renderer:build: Build complete in 1361ms
@asym/pdf-renderer:build: Build complete in 1375ms

demo:build: Error: EPERM: operation not permitted, symlink 'C:\Users\Conrad\Documents\GitHub\react-PDF\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core' -> 'C:\Users\Conrad\Documents\GitHub\react-PDF\apps\demo\.react-email\node_modules\@babel\core'
playground:build: Error: EPERM: operation not permitted, symlink 'C:\Users\Conrad\Documents\GitHub\react-PDF\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core' -> 'C:\Users\Conrad\Documents\GitHub\react-PDF\playground\.react-email\node_modules\@babel\core'

Tasks:    8 successful, 11 total
Cached:    7 cached, 11 total
Failed:    demo#build
```

### `pnpm lint`

Result: passed with the existing upstream CSS warning.

Key output:

```text
Checked 1172 files in 399ms. No fixes applied.
Found 1 warning.
apps\web\src\app\editor\editor-overrides.css:7:21 lint/complexity/noImportantStyles
```

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

### `git diff --check`

Result: passed.

Output:

```text
warning: in the working copy of 'docs/decision-log.md', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'docs/roadmap.md', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'openspec/changes/build-pdf-document-builder/tasks.md', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'packages/pdf-renderer/readme.md', LF will be replaced by CRLF the next time Git touches it
```

## Skipped Or Failed Checks

No Phase 10 targeted checks were skipped. The only failed command was broad
`pnpm build`, blocked by the already documented Windows upstream
demo/playground `.react-email` symlink issue. Targeted `@asym/pdf-renderer`
test, typecheck, and build passed.

## Update Log And Revert Guidance

- `packages/pdf-renderer/src/print-shell.ts`: added Phase 10 print shell API,
  page-size resolution, CSS generation, title escaping, and invalid settings
  handling. Revert by deleting the file and removing its root export.
- `packages/pdf-renderer/src/index.ts`: exported Phase 10 print shell symbols
  and updated package boundary maturity. Revert by removing print shell exports
  and restoring maturity to `phase-09-serializer-foundation`.
- `packages/pdf-renderer/src/compose-pdf-document-html.ts`: added the
  `invalid_page_settings` warning code so print shell errors share the existing
  renderer warning shape. Revert by removing that code from the union after
  deleting print shell usage.
- `packages/pdf-renderer/test/print-shell.spec.ts`: added Phase 10 shell
  coverage. Revert by deleting the file.
- `packages/pdf-renderer/test/public-entry.spec.ts`: added root export coverage
  and updated maturity expectation. Revert with the root export removal.
- `packages/pdf-renderer/readme.md`: documented Phase 10 API and DocRaptor CSS
  compatibility notes. Revert by restoring the Phase 9-only wording.
- `docs/decision-log.md`, `docs/roadmap.md`, and
  `openspec/changes/build-pdf-document-builder/tasks.md`: recorded Phase 10
  decisions and marked Phase 11 next. Revert those tracker/doc edits if Phase
  10 is backed out.

## Phase 11 Handoff

Phase 11 should implement the server-only DocRaptor client package. It should
consume generated print HTML/CSS later through explicit server-side APIs, keep
API keys out of browser bundles, mock all network calls in tests, and preserve
the Phase 9 serializer plus Phase 10 print shell regression coverage.
