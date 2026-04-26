# Phase 11 Completion Notes: DocRaptor Client Package

Date: 2026-04-26T16:24:32.7133018+07:00

Branch: `codex/phase-11-docraptor-client`

Base commit: `47b4cd64` (`Merge pull request #10 from Asymmetric-al/codex/phase-10-print-shell`)

Machine details:

- OS: Windows
- Node: `v24.11.1`
- pnpm: `10.33.0`

## Implementation Notes

Phase 11 implemented the server-only `@asym/docraptor-client` package. The
package now exports `createDocRaptorClient`, typed request/result/error
contracts, `DocRaptorClientError`, and the updated `docraptorClientBoundary`.

The client uses direct REST calls aligned with the official DocRaptor docs:

- `POST https://api.docraptor.com/docs`
- Basic auth with API key as username and blank password.
- PDF payloads with `document_content`, `test`, `tag`, and
  `prince_options.media` / `prince_options.baseurl`.
- Async creation with `async: true`.
- Status polling through `https://docraptor.com/status/{status_id}`.

The client defaults to test mode, uses injected `fetch` for tests, supports
timeouts and caller abort signals, normalizes HTTP/DocRaptor/network errors,
and keeps app-layer idempotency metadata without inventing a DocRaptor
idempotency header.

No editor UI, renderer orchestration, DocRaptor secrets, environment variable
reads, retry/backoff policy, or real network calls were added.

## Phase 11 Review Fix Addendum

Date: 2026-04-26T17:25:22.2007163+07:00

The Phase 11 review found four follow-up issues in the DocRaptor client
implementation. They were fixed with a narrow TDD pass:

- Sync renders no longer send async-only `callback_url` payload fields.
  Async render creation still sends `callback_url` when provided.
- Successful-response body read failures from `arrayBuffer()` or `text()` are
  normalized into `DocRaptorClientError` with `code: "network_error"` and
  `retryable: true`. Malformed JSON still reports `invalid_response`.
- `createDocRaptorClient` now asserts the server-only runtime at factory time,
  and `packages/docraptor-client/package.json` no longer marks the package as
  side-effect free because the import-time server guard is intentional.
- Browser-guard tests now restore temporary `window` and `document` globals in
  `finally` and cover the factory-level runtime guard.

The pre-fix TDD run of `pnpm --filter @asym/docraptor-client test` failed as
expected: the sync payload still included `callback_url`, body stream failures
escaped as raw `Error` instances, and the factory-level browser guard did not
throw. The focused package tests pass after the fixes.

## Files Changed

- `packages/docraptor-client/package.json`
- `packages/docraptor-client/src/index.ts`
- `packages/docraptor-client/src/client.ts`
- `packages/docraptor-client/src/errors.ts`
- `packages/docraptor-client/src/server-only.ts`
- `packages/docraptor-client/src/types.ts`
- `packages/docraptor-client/test/docraptor-client.spec.ts`
- `packages/docraptor-client/test/browser-guard.spec.ts`
- `packages/docraptor-client/test/public-entry.spec.ts`
- `packages/docraptor-client/readme.md`
- `docs/decision-log.md`
- `docs/package-boundaries.md`
- `docs/package-strategy.md`
- `docs/roadmap.md`
- `openspec/changes/build-pdf-document-builder/design.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`

## Validation Output

### `pnpm --filter @asym/docraptor-client test`

Result: passed.

```text
> @asym/docraptor-client@0.0.0 test ...\packages\docraptor-client
> vitest run

RUN  v4.1.4 .../packages/docraptor-client

Test Files  3 passed (3)
     Tests  13 passed (13)
Duration  761ms
```

### `pnpm --filter @asym/docraptor-client typecheck`

Result: passed.

```text
> @asym/docraptor-client@0.0.0 typecheck ...\packages\docraptor-client
> tsc --noEmit
```

### `pnpm --filter @asym/docraptor-client build`

Result: passed.

```text
> @asym/docraptor-client@0.0.0 build ...\packages\docraptor-client
> tsdown

[CJS] dist\index.cjs  15.18 kB | gzip: 4.14 kB
[ESM] dist\index.mjs  15.04 kB | gzip: 4.11 kB
Build complete
```

### `pnpm test`

Result: passed.

```text
> react-email-monorepo@0.0.0 test ...\react-PDF
> turbo run test

@asym/docraptor-client:test:
Test Files  3 passed (3)
     Tests  13 passed (13)

@react-email/editor:test:
Test Files  50 passed (50)
     Tests  460 passed | 1 skipped (461)

Tasks:    15 successful, 15 total
Cached:    14 cached, 15 total
Time:      3.054s
```

Observed non-blocking upstream warnings during the broader test run:

- Vitest warning about nested `vi.mock("react-dom/server")` in
  `@react-email/render` tests.
- React key warnings from existing editor serializer tests.
- Vite dynamic import warning in `apps/web`.

### `pnpm build`

Result: failed for the known Windows upstream demo/playground symlink issue.
Targeted Phase 11 package build passed.

```text
demo:build: Error: EPERM: operation not permitted, symlink
...\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core
-> ...\apps\demo\.react-email\node_modules\@babel\core

playground:build: Error: EPERM: operation not permitted, symlink
...\node_modules\.pnpm\@babel+core@7.29.0\node_modules\@babel\core
-> ...\playground\.react-email\node_modules\@babel\core

Tasks:    8 successful, 11 total
Failed:   playground#build
```

### `pnpm lint`

Result: passed with the existing CSS warning.

```text
> react-email-monorepo@0.0.0 lint ...\react-PDF
> biome check

Checked 1179 files in 656ms. No fixes applied.
Found 1 warning.
apps\web\src\app\editor\editor-overrides.css:7:21
lint/complexity/noImportantStyles
```

### `pnpm dlx @fission-ai/openspec@latest validate build-pdf-document-builder`

Result: passed.

```text
Change 'build-pdf-document-builder' is valid
```

### `pnpm dlx @fission-ai/openspec@latest validate --all`

Result: passed.

```text
✓ change/build-pdf-document-builder
Totals: 1 passed, 0 failed (1 items)
- Validating...
```

## Known Warnings And Gaps

- Root `pnpm build` still fails on Windows when upstream `demo` and
  `playground` builds attempt to create `.react-email` symlinks. This is a
  pre-existing baseline caveat and not caused by Phase 11.
- Phase 11 does not implement retry/backoff; it only classifies retryable
  errors. Phase 28 owns async retry policy.
- Phase 11 does not wire DocRaptor into preview or renderer orchestration.
  Phase 12 owns preview infrastructure.
- Phase 11 does not read environment variables. Server apps must inject the
  API key from their own configuration.

## Revert Guidance

To revert Phase 11 without touching prior phases:

1. Restore `packages/docraptor-client/src/index.ts` to the boundary-only
   export and delete `src/client.ts`, `src/errors.ts`, `src/server-only.ts`,
   and `src/types.ts`.
2. Restore `packages/docraptor-client/package.json` to the Phase 3 package
   shell metadata if reverting the whole package implementation.
3. Delete `packages/docraptor-client/test/docraptor-client.spec.ts` and
   `packages/docraptor-client/test/browser-guard.spec.ts`.
4. Restore `packages/docraptor-client/test/public-entry.spec.ts` to the
   Phase 3 boundary assertion.
5. Restore `packages/docraptor-client/readme.md` to the package-shell docs.
6. Revert Phase 11 entries in `docs/decision-log.md`,
   `docs/package-boundaries.md`, `docs/package-strategy.md`,
   `docs/roadmap.md`, `openspec/changes/build-pdf-document-builder/design.md`,
   and `openspec/changes/build-pdf-document-builder/tasks.md`.
7. Remove this completion note.

## Phase 12 Handoff

Phase 12 should build browser preview and true DocRaptor preview strategy on
top of:

- `packages/docraptor-client/src/client.ts`
- `packages/docraptor-client/test/docraptor-client.spec.ts`
- `packages/docraptor-client/readme.md`
- `packages/pdf-renderer/src/print-shell.ts`
- `packages/pdf-renderer/src/compose-pdf-document-html.ts`
- `openspec/changes/build-pdf-document-builder/tasks.md`

Browser preview must remain non-final fidelity. True PDF preview must call
DocRaptor from server-side code only, preferably through test mode.
