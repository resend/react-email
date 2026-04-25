# Project Context

## Purpose

`Asymmetric-al/react-PDF` is the React Email fork that will become the
Asymmetric.al PDF Document Builder. The goal is to transform the React Email
Editor foundation into a PDF-first document builder that can eventually replace
the current Unlayer-powered PDF Studio used by the broader Asymmetric.al
platform.

The builder must support branded documents, donor receipts, tax receipts,
annual giving statements, donor letters, missionary support reports, financial
reports, invoices, certificates, dynamic data binding, repeaters, conditionals,
image and asset handling, DocRaptor rendering, and large batch generation.

## Current state

The repo is still close to upstream React Email:

- Root package is still named `react-email-monorepo`.
- `packages/editor` still publishes as `@react-email/editor`.
- The editor is built on TipTap and ProseMirror.
- The editor currently serializes to React Email components and email-ready
  HTML.
- The repo uses pnpm, Turbo, Biome, TypeScript, Vitest, Playwright browser
  tests, and tsdown.
- The README and docs are still mostly email-oriented.

## Target state

The repo should evolve into a PDF-first document builder with packages such as:

- `@asym/pdf-template-schema`
- `@asym/pdf-editor`
- `@asym/pdf-renderer`
- `@asym/docraptor-client`
- `@asym/pdf-studio-adapter`

The production PDF renderer target is DocRaptor. Puppeteer may exist as a local
development or fallback renderer, but DocRaptor is the production fidelity
contract.

## Core product target

The React Email fork should become a standalone PDF-first builder package set
with broad Unlayer Document Builder parity for Asymmetric.al needs. It should
own the template schema, editor, serializer, DocRaptor-first rendering path,
preflight, variables, repeaters, conditionals, financial tables, branded
documents, batch generation, logs, storage interfaces, and core adapter.

Structured template JSON remains the source of truth. Raw exported HTML is a
render artifact, not the editable template model.

Integration into `Asymmetric-al/core` happens later through an adapter and
feature flag so the current Unlayer-powered PDF Studio can migrate safely.

## Product intent

The product should become a serious Unlayer Document Builder competitor for
Asymmetric.al use cases. It does not need to match every Unlayer feature
exactly, but it must match the meaningful core capabilities needed for
nonprofit and ministry operations:

- branded document templates
- dynamic variables and merge tags
- repeatable data sections
- conditional content
- data-bound financial tables
- reliable page layout
- headers, footers, and page numbers
- image and asset management
- DocRaptor PDF output
- large batch runs
- auditability and render logs
- safe migration from legacy Unlayer templates

## Development principle

The system must store structured, versioned document JSON as the source of
truth. Raw exported HTML must not be the only source of truth.

The project must evolve from the existing React Email fork structure rather
than replacing it with an unrelated architecture. New PDF-first packages,
exports, specs, tests, and docs should follow the repo's current pnpm, Turbo,
Biome, TypeScript, Vitest, Playwright, tsdown, package export, docs, and
editor-extension patterns unless a later OpenSpec change documents a reason to
diverge.

The project should move gradually:

1. Preserve the React Email editor baseline.
2. Isolate the editor package.
3. Add PDF template schema.
4. Add PDF serializer.
5. Add DocRaptor rendering.
6. Add document-specific extensions.
7. Add batch generation.
8. Integrate into `Asymmetric-al/core` through an adapter once stable.

## OpenSpec policy

Any non-trivial feature work on this PDF builder should start with or update an
OpenSpec change. OpenSpec is the durable source of product intent and behavior.
Implementation agents must read the active OpenSpec before changing editor,
renderer, schema, DocRaptor, batch, migration, or integration code.
