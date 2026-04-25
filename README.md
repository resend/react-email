# Asymmetric.al PDF Document Builder

This repository is the Asymmetric.al fork of
[`resend/react-email`](https://github.com/resend/react-email). It is being
turned into a PDF-first document builder for nonprofit and ministry workflows:
donation receipts, tax receipts, annual giving statements, donor letters,
missionary support reports, financial reports, invoices, certificates, branded
documents, and large batch generation.

The project still has React Email roots. The current editor foundation is
`@react-email/editor`, built on TipTap and ProseMirror, and the monorepo still
contains upstream React Email packages while the fork is refactored in phases.
That baseline is intentional: the editor already provides structured document
JSON, extension points, menus, inspector patterns, theming, image handling, and
serializer conventions that are useful for a PDF document builder.

## Current Status

This is not yet a production-ready PDF builder package. The fork is in the
foundation phase.

- OpenSpec is the source of product intent and behavior.
- The upstream baseline is frozen in `docs/baseline-test-results.md`.
- `packages/editor` still publishes as `@react-email/editor@1.1.1`.
- The root package is still `react-email-monorepo`.
- No `@asym/*` PDF packages have been introduced yet.
- DocRaptor is the production PDF rendering target.
- Puppeteer may be used later only for local preview, debugging, or fallback.

## Product Direction

The target system is a first-party PDF builder package set that can later be
ported into `Asymmetric-al/core` and replace or sit beside the current
Unlayer-powered PDF Studio behind a feature flag.

The durable source of truth for official templates is structured, versioned
document JSON. Raw exported HTML is a render artifact, not the editable
template model.

Core capabilities planned by OpenSpec:

- PDF-first editor for structured document templates
- typed template schema and runtime validation
- variables, merge tags, fallbacks, and formatters
- conditional sections and repeaters
- data-bound financial tables with totals and subtotals
- page setup, page breaks, headers, footers, and page numbers
- tenant brand defaults and template-level overrides
- render-safe image, font, and asset handling
- DocRaptor print HTML/CSS rendering
- browser preview clearly marked as non-authoritative
- batch generation with retries, partial failures, and audit logs
- migration and coexistence with legacy Unlayer templates
- future adapter boundary for `Asymmetric-al/core`

## OpenSpec First

Before changing PDF builder behavior, read these files:

- `AGENTS.md`
- `openspec/project.md`
- `openspec/changes/build-pdf-document-builder/proposal.md`
- `openspec/changes/build-pdf-document-builder/design.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`
- `openspec/changes/build-pdf-document-builder/specs/**`

The canonical phase tracker is
`openspec/changes/build-pdf-document-builder/tasks.md`. The current readable
roadmap mirror is `docs/roadmap.md`.

Do not implement large product changes without an OpenSpec change. Keep each
pull request scoped to the current phase.

## Important Docs

- `docs/asym-product-charter.md`: product target, users, parity definition,
  non-goals, and success criteria
- `docs/research-basis.md`: React Email editor baseline, Unlayer research,
  DocRaptor paged-media basis, and current PDF Studio expectations
- `docs/decision-log.md`: durable decisions and tradeoffs discovered during
  implementation
- `docs/roadmap.md`: 32-phase roadmap status
- `docs/baseline-test-results.md`: upstream SHA, machine details, command
  results, skipped checks, known baseline risks, and handoff notes
- `MAINTAINERS.md`: current ownership and governance expectations

## Monorepo Shape

Current upstream-shaped packages remain in place while the fork evolves:

```text
apps/
benchmarks/
examples/
openspec/
packages/
  create-email/
  editor/
  react-email/
  render/
  tsconfig/
  ui/
playground/
scripts/
skills/
```

Expected future package targets include:

```text
packages/pdf-template-schema
packages/pdf-editor
packages/pdf-renderer
packages/docraptor-client
packages/pdf-studio-adapter
```

Do not delete or rename upstream React Email packages until the active phase
explicitly calls for it.

## Development

Use `pnpm`.

```sh
pnpm install --frozen-lockfile --prefer-offline
pnpm asym:baseline-smoke
pnpm lint
pnpm --filter @react-email/editor test:unit
pnpm test
```

Useful broader checks:

```sh
pnpm build
pnpm -r --if-present typecheck
pnpm dlx @fission-ai/openspec@latest validate build-pdf-document-builder
pnpm dlx @fission-ai/openspec@latest validate --all
```

Baseline caveats from the Phase 1 validation run:

- `pnpm build` failed on this Windows machine because `playground` and
  `apps/demo` attempted to create symlinks inside generated `.react-email`
  directories.
- `pnpm -r --if-present typecheck` failed in existing upstream Tailwind e2e
  fixtures.
- `pnpm test`, `pnpm lint`, the editor unit tests, the smoke script, and
  OpenSpec validation passed.

See `docs/baseline-test-results.md` for exact output.

## Engineering Rules

- Keep package code independent from `Asymmetric-al/core` application internals.
- Use adapter interfaces for future storage, auth, tenant, asset, permission,
  audit, queue, and feature-flag services.
- Keep DocRaptor API keys server-only.
- Treat donor and financial data as private by default.
- Store structured template JSON as the editable source of truth.
- Keep render output, serializers, generated CSS, logs, and snapshots
  deterministic.
- Preserve existing editor behavior while moving from email-first to PDF-first.
- Add focused tests for every meaningful behavior change.
- Record durable decisions in `docs/decision-log.md`.

## License And Attribution

This fork retains the upstream MIT license. React Email remains the foundation
and upstream source for the current editor and package baseline. Asymmetric.al
PDF Document Builder work is tracked in this repository's OpenSpec and docs.
