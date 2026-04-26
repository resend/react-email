# @asym/docraptor-client

Phase 11 server-only DocRaptor REST client for the Asym PDF Document Builder.

## Purpose

This package owns DocRaptor API calls for the PDF builder package set:

- synchronous PDF rendering
- asynchronous render job creation
- status polling
- test and production mode selection
- request timeouts and caller abort signals
- normalized DocRaptor and network errors
- app-layer idempotency metadata

It is the only package in this repo that should talk directly to DocRaptor.
It remains private while the package APIs mature.

## Public API Promise

Current root exports:

- `createDocRaptorClient`
- `DocRaptorClient`
- `DocRaptorClientConfig`
- `DocRaptorRenderRequest`
- `DocRaptorSyncRenderResult`
- `DocRaptorAsyncRenderJob`
- `DocRaptorAsyncRenderStatus`
- `DocRaptorClientError`
- `DocRaptorClientErrorCode`
- `DocRaptorIdempotencyMetadata`
- `docraptorClientBoundary`
- `DocRaptorClientBoundary`

The client uses DocRaptor's REST API directly. It posts JSON to `/docs`,
authenticates with HTTP Basic auth using the API key as the username and a
blank password, and polls async jobs through `/status/{status_id}`.

DocRaptor references:

- https://docraptor.com/documentation/api/making_documents
- https://docraptor.com/documentation/api
- https://docraptor.com/documentation/api/status_codes

## Usage

```ts
import { createDocRaptorClient } from '@asym/docraptor-client';

const docraptor = createDocRaptorClient({
  apiKey: process.env.DOCRAPTOR_API_KEY ?? '',
  mode: 'test',
});

const result = await docraptor.renderSync({
  html: '<!doctype html><html><body>Preview</body></html>',
  name: 'Donation receipt preview',
  baseUrl: 'https://assets.example.test/receipts/',
  idempotency: {
    key: 'tenant/template-version/data-hash/preview',
    scope: 'preview',
  },
});

await savePdf(result.pdf);
```

## Modes

`mode` defaults to `test` so local and preview usage does not accidentally
create billable production renders. Production render callers must explicitly
create a client with `mode: 'production'`.

## Timeouts And Abort

`defaultTimeoutMs` defaults to `60_000`. Individual requests can pass
`timeoutMs` and `signal`. Timeout errors use code `timeout` and are retryable.
Caller aborts use code `aborted` and are not retryable.

## Idempotency Metadata

DocRaptor does not expose a first-class idempotency key in the REST API. This
package keeps idempotency metadata in result objects for app-layer render job
tracking. When a request does not provide an explicit DocRaptor `tag`, the
idempotency key is sent as the DocRaptor `tag` for log correlation only.

## Server-Only Contract

This package has no browser export path and includes a runtime guard that
throws in browser-like environments. It does not read environment variables,
store credentials, or expose API keys in normalized errors. Applications should
provide the API key from server-side configuration.

## Non-goals

- No React editor UI.
- No template schema validation.
- No renderer or print-shell coupling.
- No browser preview implementation.
- No retry/backoff policy beyond retryable error classification.
- No tenant storage, auth, queue, or core app imports.

## Maturity

`phase-11-client`. The package is private to prevent accidental publication
while preview, retry, batch, and core adapter phases are still pending.

## Development

```sh
pnpm --filter @asym/docraptor-client build
pnpm --filter @asym/docraptor-client typecheck
pnpm --filter @asym/docraptor-client test
```

Later `Asymmetric-al/core` support may add Bun or different task runners, but
this fork follows the current pnpm, Turbo, TypeScript, Vitest, and tsdown
toolchain first.
