# Delta for PDF Rendering Pipeline

## ADDED Requirements

### Requirement: Structured template rendering

The system SHALL render from structured document JSON and template metadata.
Raw HTML MUST NOT be the only source of truth for official templates.

#### Scenario: Render annual statement from template JSON

- GIVEN a published annual giving statement template has structured document
  JSON and metadata
- WHEN rendering begins
- THEN the renderer validates the template schema before serialization
- AND the render record references the template version

#### Scenario: Missing data blocks render

- GIVEN a tax receipt template requires donor identity and receipt number
- WHEN required data is missing
- THEN rendering fails with a structured missing-data error
- AND no official PDF artifact is stored

### Requirement: Print-ready HTML and CSS

The renderer SHALL produce deterministic print-ready HTML and CSS suitable for
DocRaptor.

#### Scenario: Serializer creates print shell

- GIVEN a document template has page settings and content blocks
- WHEN the renderer serializes the template
- THEN it creates a print HTML shell and deterministic CSS
- AND the output can be snapshot tested

#### Scenario: Invalid CSS is detected

- GIVEN a block contains CSS that cannot be safely rendered by DocRaptor
- WHEN preflight runs
- THEN the renderer returns a structured warning or error
- AND publish or production render is blocked when required

### Requirement: DocRaptor production rendering

The system SHALL use server-side DocRaptor rendering for production PDFs.
DocRaptor API credentials MUST remain server-only.

#### Scenario: Production donation receipt render

- GIVEN a donation receipt template is published
- WHEN an authorized production render is requested
- THEN the server submits print-ready HTML/CSS to DocRaptor
- AND the resulting PDF is recorded as DocRaptor-rendered

#### Scenario: DocRaptor timeout

- GIVEN DocRaptor times out during production rendering
- WHEN the renderer receives the timeout
- THEN it records a retryable render failure
- AND it does not store a partial PDF as official output

### Requirement: DocRaptor preview rendering

The system SHALL provide true PDF preview through DocRaptor test mode or an
equivalent non-production DocRaptor rendering path.

#### Scenario: Finance previews financial report

- GIVEN a finance user reviews a financial report template
- WHEN they request PDF preview
- THEN the system performs a DocRaptor test render
- AND the preview result includes render warnings and errors

### Requirement: Sync and async rendering

The renderer SHALL support sync rendering for small documents and async
rendering for long or batch documents.

#### Scenario: Short donor letter renders synchronously

- GIVEN a short donor letter is rendered outside a batch
- WHEN it fits configured sync limits
- THEN the renderer may use synchronous DocRaptor rendering
- AND the result is stored or returned according to render intent

#### Scenario: Async job partial failure

- GIVEN a batch has many async DocRaptor jobs
- WHEN one job fails while others complete
- THEN the failed job records its error
- AND completed jobs remain successful

### Requirement: Asset and font reachability

The renderer SHALL validate that images, fonts, and other assets are reachable
by DocRaptor before publish or production rendering.

#### Scenario: Missing image

- GIVEN a receipt template references a logo that no longer exists
- WHEN preflight runs
- THEN the renderer returns a blocking asset error
- AND DocRaptor is not called for production render

#### Scenario: Font unavailable

- GIVEN a template uses a custom brand font
- WHEN DocRaptor cannot fetch the font URL
- THEN preflight returns a font reachability warning or error
- AND approved fallback behavior is applied only when configured

### Requirement: Page setup serialization

The renderer SHALL serialize page size, orientation, margins, page counters,
and page rules into DocRaptor-compatible CSS.

#### Scenario: Page size and margins are serialized

- GIVEN a Legal landscape financial report with custom margins
- WHEN print CSS is generated
- THEN the CSS includes the selected page size, orientation, and margins
- AND the values are deterministic

#### Scenario: Page counters are serialized

- GIVEN a template uses Page X of Y
- WHEN the renderer builds print CSS
- THEN it emits DocRaptor-compatible page counter rules
- AND browser preview is not treated as proof of final page count

### Requirement: Header/footer serialization

The renderer SHALL serialize headers and footers into DocRaptor-compatible
structures.

#### Scenario: Repeating footer render

- GIVEN an annual giving statement has a repeating footer
- WHEN the renderer serializes the document
- THEN the footer is represented using print-safe page region or margin-box
  behavior
- AND the footer content can repeat across pages

### Requirement: Render warnings and errors

The renderer SHALL return structured warnings and errors for validation,
missing data, unsupported layout, asset failures, DocRaptor failures, and retry
state.

#### Scenario: Unsupported layout warning

- GIVEN a template uses a browser-only layout feature
- WHEN preflight runs
- THEN the renderer returns an unsupported-layout warning
- AND staff can identify the offending block

### Requirement: Artifact storage

Generated PDFs SHALL be stored with tenant-safe paths and metadata once
integrated into the broader platform.

#### Scenario: Store generated tax receipt

- GIVEN a production tax receipt render succeeds after core integration
- WHEN the artifact is stored
- THEN the storage path is tenant-scoped
- AND metadata includes template version, data snapshot hash, renderer, and
  render time

### Requirement: Idempotency

Render jobs SHALL be idempotent when retried with the same template version,
data snapshot, recipient or record id, and render intent.

#### Scenario: Retry after transient failure

- GIVEN a render job fails due to a transient network error
- WHEN the job is retried
- THEN it uses the same idempotency key
- AND the system does not create duplicate official documents

### Requirement: Puppeteer fallback

The system SHALL base production PDF parity on DocRaptor output even when
Puppeteer is supported for local preview or emergency fallback.

#### Scenario: Puppeteer output differs

- GIVEN Puppeteer preview differs from DocRaptor preview
- WHEN production fidelity is evaluated
- THEN DocRaptor output is authoritative
- AND the mismatch is logged for follow-up
