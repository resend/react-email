# Maintainers

This repository is the Asymmetric.al PDF Document Builder fork. It has roots in
`resend/react-email`, but its product direction is PDF-first document building.

## Initial Owner

- `@cobmojo`

`CODEOWNERS` routes all repository paths to the initial owner until a dedicated
Asymmetric.al maintainer team exists.

## Governance Expectations

- Read `AGENTS.md` before PDF builder work.
- Treat OpenSpec as the durable product and behavior contract.
- Use `openspec/changes/build-pdf-document-builder/tasks.md` as the canonical
  32-phase tracker.
- Keep each change scoped to the current phase.
- Preserve upstream React Email behavior unless the current phase explicitly
  changes it.
- Record product decisions and tradeoffs in `docs/decision-log.md`.
- Leave handoff notes with checks run, skipped checks, known gaps, and the next
  phase entry point.

## Security And Data Rules

- Keep DocRaptor API keys server-only.
- Treat donor and financial data as private by default.
- Do not store raw exported HTML as the only editable template source.
- Keep generated output deterministic when it is serialized, snapshotted, or
  logged.
