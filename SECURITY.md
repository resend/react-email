# Security Policy

This repository will contain PDF document builder packages for donor,
financial, and ministry documents. Security issues may affect private donor
data, financial data, rendered PDFs, tenant assets, DocRaptor rendering, or
future integration with `Asymmetric-al/core`.

## Supported Scope

The project is still in foundation work. There are no stable `@asym/*` package
versions yet.

Security review currently covers:

- repository governance and documentation
- the inherited React Email fork baseline
- future PDF builder design and package boundaries
- server-only DocRaptor credential handling
- tenant, donor, and financial data safety expectations

## Reporting A Vulnerability

Do not open a public issue for a suspected security vulnerability.

Use GitHub private vulnerability reporting if it is enabled for the repository.
If private reporting is unavailable, contact the maintainer listed in
`MAINTAINERS.md` and provide enough detail to reproduce the issue privately.

Include:

- affected package, app, or docs path
- commit SHA and branch
- reproduction steps
- observed impact
- whether donor, financial, tenant, asset, render, or credential data could be
  exposed

## Data Rules

- DocRaptor API keys must remain server-only.
- Donor and financial data is private by default.
- Real donor or financial records must not be committed to fixtures, tests,
  logs, screenshots, docs, or examples.
- Generated PDFs that contain private data are protected render artifacts, not
  reusable public assets.
- Structured template JSON is the editable source of truth; raw exported HTML
  must not become the only source of an official template.
