# Delta for Unlayer Migration And Core Integration

## ADDED Requirements

### Requirement: Legacy Unlayer coexistence

The system SHALL allow existing Unlayer templates in the broader platform to
remain usable during transition.

#### Scenario: Existing Unlayer template remains editable in legacy editor

- GIVEN a template is marked as legacy Unlayer
- WHEN staff open it during migration
- THEN the broader platform opens the legacy editor path
- AND the native PDF builder does not attempt automatic ownership

### Requirement: Engine metadata

Templates SHALL record which engine owns them after integration into the
broader platform. Supported engine values SHALL include `unlayer` and
`asym_pdf_document_builder`.

#### Scenario: New template uses new editor

- GIVEN the native builder feature flag is enabled
- WHEN staff create a new donation receipt template with the native builder
- THEN the template engine is recorded as `asym_pdf_document_builder`
- AND the template source of truth is structured document JSON

### Requirement: Feature flag rollout

The system SHALL support feature-flagged rollout after integration into
`Asymmetric-al/core`.

#### Scenario: Feature flag disabled returns to legacy path

- GIVEN the native PDF builder feature flag is disabled for a tenant
- WHEN staff open PDF Studio
- THEN legacy Unlayer behavior remains available
- AND native-only template creation is hidden or disabled

### Requirement: Manual migration path

The system SHALL support manual rebuild of legacy templates.

#### Scenario: Admin migrates one tax receipt manually

- GIVEN a tenant has a legacy Unlayer tax receipt template
- WHEN an admin manually rebuilds it in the native builder
- THEN the new template is stored as a separate native template
- AND the legacy template remains available until intentionally archived

### Requirement: Optional partial import

The system SHALL NOT promise perfect conversion from Unlayer design JSON when
optional partial import from exported HTML is supported.

#### Scenario: Partial HTML import is attempted

- GIVEN staff import exported HTML from a simple Unlayer template
- WHEN the importer cannot map a block safely
- THEN the system marks the unsupported block for manual rebuild
- AND it does not claim a lossless migration

### Requirement: Core repo adapter

The new editor SHALL integrate into `Asymmetric-al/core` through a package and
adapter that preserves app boundaries.

#### Scenario: Adapter handles core storage and permissions

- GIVEN the native builder is integrated into core
- WHEN a template is rendered
- THEN the adapter supplies tenant data, permissions, storage, assets, and audit
  hooks
- AND the PDF builder packages remain independent of core app internals

### Requirement: Existing PDF Studio concepts

The new system SHALL preserve current PDF Studio concepts: template categories,
page size, orientation, margins, merge tags, tenant scoping, template CRUD, and
HTML/PDF export expectations.

#### Scenario: Existing concepts map to native template

- GIVEN staff rebuild an annual statement from current PDF Studio behavior
- WHEN they create the native version
- THEN category, page size, orientation, margins, merge tag domains, and
  preview/export expectations are represented
- AND unsupported legacy behavior is surfaced explicitly

### Requirement: Safe cutover

The system SHALL allow template-type-by-template-type cutover.

#### Scenario: Old rendered PDFs remain accessible

- GIVEN a legacy Unlayer template has already generated PDFs
- WHEN the tenant starts using native templates for new receipts
- THEN old rendered PDFs remain accessible through existing storage/audit paths
- AND new renders use the native engine only for selected template types

#### Scenario: Batch generation uses only published new templates

- GIVEN batch generation is enabled for native annual statements
- WHEN staff start a batch
- THEN the system requires a published native template
- AND it does not run batch generation from draft or legacy templates unless a
  separate legacy batch path explicitly supports it
