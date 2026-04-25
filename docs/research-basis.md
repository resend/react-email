# Research Basis

## Repo Baseline

Observed Phase 1 repo facts:

- Branch: `canary`
- Fork HEAD at planning time: `f53bb0e814f630efd0774240355d97d55046a6c3`
- Frozen upstream React Email canary SHA:
  `d064012cd5a3b4817dbe03a932a6d68e83e07abb`
- Root package: `react-email-monorepo`
- Package manager: `pnpm@10.33.0`
- Local Node observed during Phase 1 planning: `v24.11.1`
- CI workflows use Node 22 or Playwright containers.
- `packages/editor` still publishes as `@react-email/editor@1.1.1`.
- `packages/editor` requires Node `>=20.0.0`.

The repo still follows upstream React Email package boundaries. Phase 1 does
not introduce PDF implementation packages.

## React Email Editor Architecture

`packages/editor` is the current editor foundation. Its package exports include
`.`, `./core`, `./extensions`, `./ui`, `./plugins`, `./utils`, editor styles,
and the default theme CSS.

The editor is built on TipTap and ProseMirror. The React Email docs describe it
as an embeddable visual editor for React Email templates with rich text
editing, bubble menus, slash commands, multi-column layouts, theming, HTML
export, image upload, and custom extensions.

The current serializer at
`packages/editor/src/core/serializer/compose-react-email.tsx` walks TipTap JSON,
maps extensions by name, renders `EmailNode` and `EmailMark` implementations,
wraps the result in a base template, and returns formatted email-ready HTML
plus plain text through `react-email`.

Future PDF serialization should reuse that architectural lesson while changing
the output target from email HTML to print-ready HTML for DocRaptor.

## Unlayer Document Builder Capabilities

Unlayer's document builder is relevant because current PDF Studio workflows use
Unlayer document mode. Public Unlayer materials describe document authoring
with `displayMode: 'document'`, design JSON loading, PDF export, dynamic
templates, merge tags, brand customization, document automation, and white-label
embedding.

For this fork, Unlayer parity means matching Asymmetric.al's required document
builder workflows, not cloning Unlayer exactly. The native builder must cover
template CRUD, categories, page settings, merge tags, PDF/HTML artifacts,
tenant assets, branded templates, and migration/coexistence paths.

## DocRaptor Paged-Media Basis

DocRaptor is the production PDF renderer target because it uses Prince and
supports print-focused CSS capabilities that browser engines do not fully
support. Relevant capabilities include:

- `@page` size and margins
- page margin boxes
- page counters and total page counters
- running headers and footers
- named pages
- page breaks and keep-together hints
- test mode
- synchronous and asynchronous document creation
- callback URLs for asynchronous jobs

Browser preview and Puppeteer output may help authors iterate, but they are not
the production fidelity contract.

## Current Asymmetric PDF Studio Expectations

OpenSpec records that the broader Asymmetric.al platform currently uses Unlayer
document mode for PDF Studio. The native builder must preserve or map these
concepts during later integration:

- template CRUD
- Unlayer design JSON coexistence
- HTML export
- PDF export
- categories
- page size
- orientation
- margins
- merge tags
- tenant storage
- future batch generation
- PDF storage and versioning

The new builder should integrate through a future adapter and feature flag so
legacy Unlayer templates remain usable during migration.

## Source Anchors

- OpenSpec project context: `openspec/project.md`
- Active OpenSpec proposal:
  `openspec/changes/build-pdf-document-builder/proposal.md`
- Active OpenSpec design:
  `openspec/changes/build-pdf-document-builder/design.md`
- Active OpenSpec tasks:
  `openspec/changes/build-pdf-document-builder/tasks.md`
- React Email editor docs: https://react.email/docs/editor/overview
- React Email `composeReactEmail` docs:
  https://react.email/docs/editor/api-reference/compose-react-email
- Unlayer document builder: https://unlayer.com/document-builder/
- DocRaptor API docs: https://docraptor.com/documentation/api
- DocRaptor CSS paged media: https://docraptor.com/css-paged-media
- DocRaptor headers and footers:
  https://docraptor.com/documentation/article/1067094-headers-footers
