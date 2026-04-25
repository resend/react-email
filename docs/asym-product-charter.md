# Asym PDF Document Builder Product Charter

## Purpose

This repository is the React Email fork that will become the Asymmetric.al PDF
Document Builder. The builder must evolve from the current `@react-email/editor`
foundation into a PDF-first authoring, template, and rendering package set that
can later replace or sit beside the current Unlayer-powered PDF Studio in
`Asymmetric-al/core`.

The source of truth for official templates is structured, versioned document
JSON. Exported HTML is a render artifact, not the editable template model.

## Target Users

- Platform admins who govern document builder capabilities and rollout.
- Finance users who create receipts, statements, invoices, and reports.
- Donor care staff who send donor letters and donor-facing documents.
- Ministry operations staff who create branded operational reports.
- Tenant organizations that need reliable, branded document output.
- Donors who receive receipts, tax records, statements, and letters.
- Missionaries or field workers represented in support reports.
- Developers who will package and port the builder into `Asymmetric-al/core`.

## Core Document Types

The first-class product target covers:

- donation receipts
- tax receipts
- annual giving statements
- donor letters
- missionary support reports
- financial reports
- invoices
- reusable branded documents
- certificates
- custom tenant documents

These documents need reliable page layout, typed data binding, variables,
repeaters, conditionals, financial tables, page numbers, asset handling,
DocRaptor PDF output, render logs, and large batch generation.

## Meaning Of Unlayer Parity

General Unlayer Document Builder parity means matching the capabilities that
matter for Asymmetric.al nonprofit and ministry workflows. It does not mean
cloning every Unlayer feature.

The required parity target includes:

- embeddable template authoring
- structured template JSON storage
- document categories and starter templates
- branded template styling
- dynamic fields and merge tags
- PDF and HTML render artifacts
- tenant-aware assets
- repeatable sections and data-bound tables
- conditional content
- safe migration and coexistence with legacy Unlayer templates

The builder should exceed generic merge-tag replacement where donor trust,
financial integrity, or batch generation require typed validation.

## Product Boundaries

This repo owns the forked editor and future PDF builder packages. It is not
`Asymmetric-al/core` and should not import app-specific storage, auth, tenant,
asset, permission, or queue services directly. Future integration must happen
through adapter interfaces.

DocRaptor is the production PDF renderer and fidelity contract. Puppeteer may
exist later for local preview, debugging, or emergency fallback, but DocRaptor
output remains authoritative for production.

## Non-Goals For The Foundation

- No immediate removal of Unlayer from the broader platform.
- No guarantee of perfect automatic Unlayer design JSON migration.
- No full real-time collaboration in the first launch.
- No e-signature provider integration in the first launch.
- No `ds.shadcn` canvas editor unless a later phase reopens that decision.
- No raw HTML as the only source of truth.
- No direct `Asymmetric-al/core` implementation in this repo during Phase 1.

## Success Criteria

The fork succeeds when future phases can build PDF-first packages without
losing the React Email editor baseline, without drifting from OpenSpec, and
without coupling package code to application internals. Every phase should
leave clear docs, tests, and handoff notes for the next phase.
