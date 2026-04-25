# Delta for PDF Document Builder

## ADDED Requirements

### Requirement: Template lifecycle

The system SHALL allow authorized users to create, edit, duplicate, publish,
archive, restore, and version PDF document templates. The system SHALL preserve
existing render history when templates are archived or restored.

#### Scenario: Create donation receipt template

- GIVEN an authorized finance user creates a donation receipt template
- WHEN they choose the donation receipt category
- THEN the builder provides organization, donor, donation, receipt number, tax
  language, logo, footer, and PDF preview options
- AND the template is stored as versioned structured document JSON

#### Scenario: Duplicate annual statement template

- GIVEN a published annual giving statement template exists
- WHEN an authorized user duplicates it
- THEN the duplicate is created as a draft with its own template identity
- AND the original published template remains unchanged

#### Scenario: Publish template after successful preflight

- GIVEN a draft tax receipt template has required variables, reachable assets,
  valid page setup, and a successful DocRaptor preview
- WHEN an authorized publisher publishes the template
- THEN the system creates an immutable published version
- AND future renders can reference that exact version

#### Scenario: Prevent publish when required variables are missing

- GIVEN a financial report template references a required report period
  variable that has no binding
- WHEN an authorized user attempts to publish
- THEN publish is blocked with a validation error
- AND no published version is created

#### Scenario: Archive without deleting render history

- GIVEN a donor letter template has generated PDFs in render history
- WHEN an authorized user archives the template
- THEN the template no longer appears as an active authoring option
- AND existing render logs and PDF artifact references remain available

#### Scenario: Restore archived template

- GIVEN an archived certificate template is still valid
- WHEN an authorized user restores it
- THEN the template returns as a draft or active template according to policy
- AND prior version history remains intact

### Requirement: Template categories

The system SHALL support document categories for donation receipt, tax receipt,
annual giving statement, donor letter, missionary report, financial report,
invoice, certificate, and custom templates.

#### Scenario: Create each major template type

- GIVEN an authorized user creates a template
- WHEN they select any supported major category
- THEN the builder applies category-appropriate starter fields and validation
- AND the category is stored in the template metadata

#### Scenario: Filter templates by category

- GIVEN templates exist across receipt, statement, report, invoice, certificate,
  and custom categories
- WHEN a user filters by financial report
- THEN only financial report templates are returned
- AND legacy category aliases can be mapped during core integration

#### Scenario: Choose a starter template

- GIVEN starter templates exist for nonprofit document use cases
- WHEN staff choose the annual giving statement starter
- THEN the draft includes donor identity, statement period, donation table,
  totals, footer, and page numbering defaults

### Requirement: First-class nonprofit and ministry use cases

The builder SHALL explicitly support first-class template authoring for
donation receipts, tax receipts, annual giving statements, donor letters,
missionary support reports, financial reports, invoices, and certificates.

#### Scenario: Donation receipt includes required receipt fields

- GIVEN staff create a donation receipt template
- WHEN they configure the template fields
- THEN the builder supports organization name, organization address,
  organization EIN, donor name, donor address, donation date, donation amount,
  donation method, gift designation, receipt number, tax language,
  goods/services language, logo, footer, and PDF export
- AND the template can be rendered as a single receipt or included in a batch

#### Scenario: Tax receipt supports year-end tax documentation

- GIVEN finance staff create a tax receipt template
- WHEN they configure year-end receipt content
- THEN the builder supports tax year, statement period, total contributions,
  tax deductible amount, goods/services value, IRS language, donor identity,
  organization identity, receipt number, PDF artifact metadata, and audit log
  metadata
- AND missing required tax fields block publish or production render

#### Scenario: Annual giving statement supports multi-page donation history

- GIVEN staff create an annual giving statement template
- WHEN they add donation history content
- THEN the builder supports donor identity, date range, donation line item
  table, grouped donations, totals, subtotals, empty states, multi-page output,
  page numbers, repeating footer, and batch rendering
- AND totals are tied to the resolved donation rows

#### Scenario: Donor letter supports rich personalized correspondence

- GIVEN donor care staff create a donor letter template
- WHEN they author the letter
- THEN the builder supports rich text, variables, signature image, letterhead,
  page setup, and PDF export
- AND the letter can preview with sample recipient data

#### Scenario: Missionary support report supports field-worker reporting

- GIVEN ministry operations staff create a missionary support report
- WHEN they configure report sections
- THEN the builder supports missionary name, location, support account,
  donor/fund details, donation summaries, report tables, images, branded
  headers, repeaters, and sections
- AND tenant scope applies to all referenced records and assets

#### Scenario: Financial report supports advanced report tables

- GIVEN finance staff create a financial report template
- WHEN they configure report content
- THEN the builder supports report title, report period, account groups, funds,
  income rows, expense rows, totals, subtotals, grouped sections, summary rows,
  multi-page tables, repeated table headers, DocRaptor rendering, export logs,
  and audit trail metadata
- AND invalid financial table bindings block publish

#### Scenario: Invoice supports line items and totals

- GIVEN staff create an invoice template
- WHEN they configure billing content
- THEN the builder supports invoice number, recipient identity, line items,
  quantity, rate, amount, subtotal, total, payment instructions, and PDF export
- AND totals are computed from the same resolved line items shown in the PDF

#### Scenario: Certificate supports branded landscape layout

- GIVEN staff create a certificate template
- WHEN they configure certificate content
- THEN the builder supports branded layout, recipient name, certificate title,
  date, signature image, optional QR placeholder, and landscape orientation
- AND preflight can warn when the certificate no longer fits its intended page

### Requirement: Rich content editing

The editor SHALL support text, headings, lists, links, buttons where
appropriate, dividers, sections, columns, images, and tables. Each block SHALL
be serializable to print-ready output.

#### Scenario: User adds text and headings

- GIVEN a staff user edits a donor letter
- WHEN they add headings and body text
- THEN the content is stored in structured editor JSON
- AND the serializer can produce print-ready output

#### Scenario: User adds two-column layout

- GIVEN a missionary support report needs a summary and image side by side
- WHEN the user adds a two-column section
- THEN the section is represented as a structured layout block
- AND preflight can warn if the layout is unsafe for print rendering

#### Scenario: User adds image with alt text

- GIVEN a user inserts a ministry image
- WHEN they provide alt text and sizing
- THEN the image block stores structured asset metadata
- AND the render pipeline can preflight the asset

#### Scenario: User adds link

- GIVEN a donor letter includes a donor portal URL
- WHEN the user inserts a link
- THEN the link is stored as a structured mark or block
- AND the PDF renderer preserves the link where supported

#### Scenario: User uses slash commands

- GIVEN the editor supports slash commands
- WHEN a user types `/table`
- THEN the editor offers supported document blocks
- AND unsupported email-only blocks are hidden or clearly marked during PDF mode

#### Scenario: User uses inspector controls

- GIVEN a user selects an image or table block
- WHEN they open inspector controls
- THEN the editor exposes PDF-relevant settings
- AND settings are stored in structured template JSON

### Requirement: Page setup

The builder SHALL support Letter, A4, Legal, custom page dimensions, portrait
orientation, landscape orientation, margins, and future full-bleed settings.

#### Scenario: Letter portrait receipt

- GIVEN a donation receipt template is created for US donors
- WHEN staff choose Letter portrait with standard margins
- THEN those page settings are stored with the template
- AND the renderer can serialize them to `@page` CSS

#### Scenario: A4 letter

- GIVEN a tenant uses A4 paper
- WHEN staff create a donor letter template
- THEN the template can use A4 page settings
- AND preview reflects the selected page size

#### Scenario: Legal financial report

- GIVEN a finance report needs additional vertical space
- WHEN staff choose Legal page size
- THEN the setting is stored as part of page setup
- AND render preflight validates the page dimensions

#### Scenario: Landscape certificate

- GIVEN staff create a certificate
- WHEN they choose landscape orientation
- THEN the builder applies landscape page setup
- AND the certificate can be validated as a one-page layout

#### Scenario: Custom page size

- GIVEN a future tenant needs a non-standard page size
- WHEN custom dimensions are enabled
- THEN the template stores explicit dimensions and units
- AND render preflight validates the values

### Requirement: Headers and footers

The builder SHALL support first-page and repeating headers and footers,
including page numbers and Page X of Y formatting.

#### Scenario: Annual statement has footer on every page

- GIVEN an annual giving statement spans multiple pages
- WHEN staff configure a repeating footer
- THEN the footer appears on every page in DocRaptor output
- AND the footer can include required tax or organization language

#### Scenario: Financial report has repeating report title

- GIVEN a financial report spans multiple pages
- WHEN staff configure a repeating header
- THEN each page can show the report title and period
- AND table content does not overwrite the header

#### Scenario: Receipt hides header on first page

- GIVEN a receipt uses tenant letterhead on the first page
- WHEN staff disable the repeating header for page one
- THEN the first page uses the configured variant
- AND later pages use the repeating header policy

#### Scenario: Page number shows Page X of Y

- GIVEN a template enables Page X of Y footer numbering
- WHEN DocRaptor renders the PDF
- THEN the footer shows current and total page counts
- AND browser preview is not treated as proof of final page count fidelity

### Requirement: Page breaks and print layout hints

The builder SHALL support explicit page breaks, keep-together hints, and
table-row split avoidance where possible.

#### Scenario: User inserts page break before appendix

- GIVEN a financial report includes an appendix
- WHEN staff insert an explicit page break before the appendix
- THEN the serialized output includes a page break at that location

#### Scenario: Financial table avoids splitting a section header from rows

- GIVEN a grouped table has a fund header followed by rows
- WHEN the document is rendered
- THEN the renderer applies keep-together hints for the header and first rows
- AND it warns if the layout cannot be honored

#### Scenario: Certificate remains one page

- GIVEN a certificate template is intended to be one page
- WHEN preflight detects content that overflows
- THEN the builder reports a validation warning or error
- AND it does not silently publish a broken certificate layout

### Requirement: Browser and PDF preview

The builder SHALL support fast browser preview and true DocRaptor preview.
Browser preview SHALL NOT be treated as final production fidelity.

#### Scenario: User previews with sample data

- GIVEN staff edit a tax receipt template
- WHEN they request sample preview
- THEN the builder resolves safe sample donor and donation data
- AND no real donor data is required

#### Scenario: User previews with real donor data

- GIVEN the builder is integrated into the broader platform
- WHEN an authorized user previews a real donor record
- THEN the system enforces tenant and role permissions
- AND the preview uses the selected donor data

#### Scenario: Browser preview warns it is not final fidelity

- GIVEN a user opens browser preview
- WHEN the preview is displayed
- THEN the UI identifies it as browser-rendered
- AND production publish still requires DocRaptor preview when configured

#### Scenario: DocRaptor preview shows final PDF output

- GIVEN a production-bound financial report template is ready for review
- WHEN staff request PDF preview
- THEN the system generates a DocRaptor test-mode PDF
- AND render logs capture warnings or errors

### Requirement: Branded templates

The builder SHALL let templates inherit tenant branding and override approved
brand fields.

#### Scenario: Receipt uses tenant logo

- GIVEN tenant branding includes a logo
- WHEN staff create a donation receipt
- THEN the receipt can inherit the tenant logo
- AND the logo uses a render-safe asset reference

#### Scenario: Report uses brand colors

- GIVEN tenant branding includes primary and accent colors
- WHEN staff create a financial report
- THEN the report can inherit those colors
- AND the renderer serializes them into deterministic print CSS

#### Scenario: Letter overrides footer text

- GIVEN a donor letter needs campaign-specific footer text
- WHEN authorized staff override the footer text for that template
- THEN the override is stored with the template version
- AND tenant defaults remain unchanged

### Requirement: Feature flag and engine selection

After integration into the broader platform, the system SHALL support a safe
transition between legacy Unlayer templates and the new PDF builder.

#### Scenario: Old template opens with legacy engine

- GIVEN a template is marked with the `unlayer` engine
- WHEN staff open it during migration
- THEN the broader platform opens it with the legacy editor
- AND the new builder does not claim ownership of that template

#### Scenario: New template opens with new engine

- GIVEN a template is marked with the `asym_pdf_document_builder` engine
- WHEN staff open it
- THEN the new PDF editor is used
- AND structured document JSON remains the source of truth

#### Scenario: Admin can identify template engine

- GIVEN a tenant has both legacy and native templates
- WHEN an admin views the template list
- THEN each template exposes engine metadata
- AND migration status is visible enough to prevent accidental cutover
