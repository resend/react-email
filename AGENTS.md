# Agent Instructions

## Project routing

This repo is the React Email fork that will become the Asymmetric.al PDF
Document Builder. Before any work on the PDF Document Builder, React Email
editor fork, document templates, PDF Studio replacement, DocRaptor rendering,
variables, repeaters, conditional sections, financial reports, branded
documents, batch document generation, Unlayer migration, or eventual
`Asymmetric-al/core` integration, read:

- `openspec/project.md`
- `openspec/changes/build-pdf-document-builder/proposal.md`
- `openspec/changes/build-pdf-document-builder/design.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`
- the related specs under
  `openspec/changes/build-pdf-document-builder/specs/**`

OpenSpec holds the durable product intent and behavior contract for this
system. `AGENTS.md` only routes agents to that intent.

## Repository expectations

- Use `pnpm` in this repo unless a later OpenSpec change explicitly moves the
  repo to another package manager.
- Do not treat this repo as `Asymmetric-al/core`. This repo owns the forked
  editor and PDF builder packages.
- Do not implement large product changes without an OpenSpec change.
- Keep the editor fork working while moving it from email-first to PDF-first.
- Preserve tests and package boundaries while refactoring.

## Skills

- Use any installed agent skill that materially helps the current phase,
  especially skills for repo discovery, TipTap/ProseMirror editor work,
  shadcn/ui, testing, TypeScript, documentation, or OpenSpec planning.
- Prefer skills as guidance for the phase at hand; OpenSpec remains the durable
  source of product intent and behavior.

## Code Style

- Write code for readability first.
- Prefer one clear operation per line when practical.
- Break compound expressions into well-named intermediate variables.
- Extract small helper functions instead of nesting, chaining, or mixing
  concerns.
- Prefer obvious code over clever or compressed code.
- Match existing repo patterns unless the task requires a deliberate change.

## Unit Tests

- After each meaningful phase of work, add or update the smallest appropriate
  unit tests for the behavior changed.
- When fixing a bug, write a regression test that fails before the fix and
  passes after it.
- Run the affected unit tests before moving on.
- Do not mark the phase complete until the relevant unit tests pass.

## Phase execution expectations

- Use `openspec/changes/build-pdf-document-builder/tasks.md` as the canonical
  36-phase process tracker for PDF Document Builder work.
- Identify the current phase before editing, complete only that phase's scope,
  and leave handoff notes before moving on.
- Inspect the repo before editing and keep each phase scoped to its OpenSpec
  task.
- Do not delete upstream React Email code unless a phase explicitly says to do
  so.
- Treat DocRaptor API keys as server-only secrets.
- Treat donor and financial data as private by default.
- Preserve deterministic rendering behavior; snapshots should not depend on
  object key order, timestamps, or random IDs.
