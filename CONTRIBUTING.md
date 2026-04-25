# Contributing

This repository is the Asymmetric.al PDF Document Builder fork of
`resend/react-email`. It is not a general-purpose React Email contribution
queue. Contributions should preserve the current upstream baseline while moving
the fork toward the OpenSpec-defined PDF builder.

## Before You Start

Read:

- `AGENTS.md`
- `openspec/project.md`
- `openspec/changes/build-pdf-document-builder/proposal.md`
- `openspec/changes/build-pdf-document-builder/design.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`
- the related specs under
  `openspec/changes/build-pdf-document-builder/specs/**`

Use `docs/roadmap.md` for a quick phase-status view and
`docs/baseline-test-results.md` for known baseline validation results.

## Scope Rules

- Keep changes scoped to the current roadmap phase.
- Do not delete upstream React Email code unless the active phase explicitly
  says to do so.
- Do not treat this repo as `Asymmetric-al/core`.
- Do not add direct app dependencies for storage, auth, tenant data, assets,
  queues, audit logs, or permissions.
- Use adapter boundaries for future platform integration.
- Update `docs/decision-log.md` when a product or architecture decision changes.

## Development Setup

Use `pnpm`.

```sh
pnpm install --frozen-lockfile --prefer-offline
pnpm asym:baseline-smoke
```

The smoke command verifies the frozen upstream baseline and that
`packages/editor/package.json` is still discoverable as `@react-email/editor`.

## Validation

Run the smallest relevant checks first, then broader checks before handoff.

Common commands:

```sh
pnpm lint
pnpm --filter @react-email/editor test:unit
pnpm test
pnpm dlx @fission-ai/openspec@latest validate build-pdf-document-builder
pnpm dlx @fission-ai/openspec@latest validate --all
```

Broader baseline commands:

```sh
pnpm build
pnpm -r --if-present typecheck
```

If a broad command fails because of an existing baseline issue, record the
exact command, result, and reason in the relevant phase notes. Do not claim a
check passed unless it did.

## Pull Requests

Each pull request should include:

- roadmap phase and scope
- user-facing summary
- files changed
- tests run with exact commands and results
- skipped checks with reasons
- decisions or tradeoffs added to `docs/decision-log.md`
- handoff notes for the next phase

Use the GitHub pull request template and keep the PR focused.

## Security And Data Handling

- Keep DocRaptor credentials server-only.
- Treat donor and financial data as private by default.
- Avoid secrets, private data, or real donor records in fixtures, snapshots,
  logs, examples, and docs.
- Keep generated output deterministic when it is serialized, snapshotted, or
  logged.
