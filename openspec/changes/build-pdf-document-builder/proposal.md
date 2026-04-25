# Build PDF Document Builder

## Summary

This change defines the product and technical specification for a first-party
PDF Document Builder in `Asymmetric-al/react-PDF`.

This repository is the React Email fork where the PDF builder work belongs. It
currently still looks like upstream React Email: the root package is named
`react-email-monorepo`, the root README describes email-oriented functionality,
and the editor starts from `packages/editor`, which still publishes as
`@react-email/editor`.

The product direction is to turn this fork into a PDF-first document builder
that supports branded documents, financial reports, receipts, dynamic data, and
large batch generation. DocRaptor is the intended production rendering engine.
The resulting packages will eventually integrate into `Asymmetric-al/core` and
replace or compete with the current Unlayer-powered PDF Studio.

## Why

Unlayer currently provides document building in the broader Asymmetric.al
platform, but that leaves critical template authoring and PDF generation
dependent on a third-party builder. Asymmetric.al needs tighter integration
with tenant data, donor data, financial reporting, permissions, audit logs, and
batch workflows than a generic external builder can provide.

Financial reports, annual giving statements, tax receipts, donation receipts,
and missionary support reports need stronger typed data binding than raw merge
tag replacement. They need repeaters, conditional sections, totals, subtotals,
grouped financial tables, render logs, and clear failure states so donor-trust
documents are not silently generated incorrectly.

DocRaptor gives the production PDF path a print-focused renderer with CSS
paged-media support. Puppeteer can help with local development or emergency
fallback, but DocRaptor is the production fidelity contract.

React Email Editor provides a strong starting point because it already has a
TipTap and ProseMirror editor foundation, structured editor JSON, an extension
system, custom nodes and marks, bubble menus, slash commands, inspector
patterns, theming patterns, image upload, and a serializer pattern. This repo
already contains that fork, so this is the correct place to define and build
the PDF-first document system.

OpenSpec is needed because this is a multi-phase platform capability, not a
single feature. Future agents need durable product intent, requirements,
architecture, and implementation phases before editing package code.

## Goals

- Create an in-house PDF document builder.
- Support general Unlayer Document Builder parity, within reason.
- Support dynamic merge tags, variable chips, repeaters, and conditionals.
- Support financial and donor reporting documents.
- Support branded templates with tenant defaults and template overrides.
- Support DocRaptor rendering for production PDFs.
- Support large batch runs with retries, partial failure handling, and audit
  logs.
- Support safe migration and coexistence with Unlayer-backed templates.
- Produce packages that can later be integrated into `Asymmetric-al/core`.
- Keep the React Email fork working while gradually moving from email-first to
  PDF-first.

## Non-goals

- No implementation is included in this OpenSpec change.
- No immediate removal of Unlayer from the broader platform.
- No promise of perfect automatic Unlayer JSON migration.
- No full real-time collaboration in the first launch.
- No e-signature provider integration in the first launch.
- No `ds.shadcn` canvas editor unless a later fixed-layout use case proves it
  is needed.
- No raw HTML as the only template source of truth.
- No `Asymmetric-al/core` product integration in this OpenSpec task.

## Users served

- Platform admins who manage document template capabilities.
- Finance users who create receipts, statements, invoices, and reports.
- Donor care staff who send letters and donor-facing documents.
- Ministry operations staff who need branded operational documents.
- Tenant organizations that need reliable, branded document output.
- Donors who receive receipts, tax records, statements, and letters.
- Missionaries or field workers referenced in reports.
- Developers who will package and port the builder into `Asymmetric-al/core`.

## Business and ministry value

The PDF Document Builder should increase donor trust, improve financial
clarity, make year-end statements more reliable, give tenants more control over
branded documents, reduce vendor dependency, fit missions workflows more
directly, make batch reporting safer, and improve the platform's ability to
audit generated documents.

## Scope

This change adds six OpenSpec spec areas:

- `pdf-document-builder`
- `pdf-rendering-pipeline`
- `document-template-data-binding`
- `document-batch-generation`
- `document-assets-branding`
- `unlayer-migration-and-core-integration`

## Rollout idea

The rollout should proceed in phases:

1. Document the product intent in OpenSpec.
2. Preserve the current React Email baseline.
3. Isolate the editor package.
4. Introduce PDF-first packages.
5. Build the schema and serializer.
6. Add DocRaptor rendering.
7. Add document-specific extensions.
8. Build batch generation.
9. Add a package adapter.
10. Integrate into `Asymmetric-al/core` behind a feature flag later.
11. Keep Unlayer templates working during migration.
