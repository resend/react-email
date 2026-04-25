# Delta for Document Assets And Branding

## ADDED Requirements

### Requirement: Tenant brand defaults

The system SHALL support tenant-level logo, colors, fonts, footer text, and
organization identity after integration into the broader platform.

#### Scenario: Template uses brand defaults

- GIVEN a tenant has configured logo, colors, fonts, and footer text
- WHEN staff create a donation receipt
- THEN the template can inherit those brand defaults
- AND inheritance is visible in template metadata or inspector controls

### Requirement: Template overrides

The system SHALL record template-level overrides with the template version when
authorized users override allowed brand fields.

#### Scenario: Report overrides brand color

- GIVEN staff create a campaign-specific financial report
- WHEN they override an allowed accent color
- THEN the override is stored with the template version
- AND tenant defaults remain unchanged

### Requirement: Asset upload

Authorized users SHALL be able to upload and select images.

#### Scenario: Logo inserted into receipt

- GIVEN a user has asset permission
- WHEN they upload a logo and insert it into a receipt
- THEN the template stores a structured asset reference
- AND the receipt can use that asset in preview and render

### Requirement: Asset library

Assets SHALL be tenant scoped after integration into the broader platform.

#### Scenario: Tenant cannot see another tenant's asset

- GIVEN assets belong to different tenants
- WHEN a user browses the asset library
- THEN only assets from the user's tenant and allowed scope appear
- AND cross-tenant asset ids cannot be used by bypassing the UI

### Requirement: Render-safe asset URLs

The system SHALL provide render-safe URLs that DocRaptor can fetch.

#### Scenario: DocRaptor can fetch public render URL

- GIVEN a template references a tenant logo
- WHEN render preflight resolves the asset
- THEN it produces a URL reachable by DocRaptor for the render window
- AND the URL does not expose unrelated private data

### Requirement: No blob URL rendering

The system SHALL never send browser blob URLs to production PDF rendering.

#### Scenario: DocRaptor cannot fetch a private URL

- GIVEN an image source is a browser blob URL or private app-session URL
- WHEN production preflight runs
- THEN preflight fails with a blocking error
- AND DocRaptor is not called with that URL

### Requirement: Image metadata

Images SHALL support alt text, sizing, and alignment.

#### Scenario: Image missing alt text

- GIVEN staff insert a meaningful image into a donor letter
- WHEN alt text is missing
- THEN publish validation warns or blocks according to accessibility policy
- AND staff can add alt text before publishing

### Requirement: Font handling

Fonts SHALL be reachable by the renderer or replaced with approved fallback
fonts.

#### Scenario: Font unavailable

- GIVEN a tenant brand uses a custom font
- WHEN DocRaptor cannot fetch the font
- THEN preflight reports the font failure
- AND approved fallback font behavior is used only when configured

### Requirement: Asset preflight

The system SHALL preflight image and font availability before publish or
production render.

#### Scenario: Image missing during render

- GIVEN a template references a deleted required image
- WHEN render preflight runs
- THEN the system returns a blocking asset error
- AND no official PDF is generated

### Requirement: Private data safety

Assets and rendered documents SHALL respect tenant boundaries.

#### Scenario: Generated statement is not reusable asset

- GIVEN an annual giving statement contains donor financial data
- WHEN the PDF is generated
- THEN it is stored as a protected render artifact
- AND it is not added to the reusable tenant asset library
