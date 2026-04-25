# Delta for Document Batch Generation

## ADDED Requirements

### Requirement: Batch run creation

Authorized users SHALL be able to create a batch run from a published template
and selected dataset after integration into the broader platform.

#### Scenario: Year-end giving statement batch

- GIVEN a finance user has batch permission
- WHEN they create a year-end annual giving statement batch
- THEN the system records tenant, actor, template, tax year, statement period,
  and recipient selection
- AND the batch begins as an auditable operational record

#### Scenario: Prevent batch if template preflight fails

- GIVEN a published template no longer has reachable assets
- WHEN staff attempt to start a batch
- THEN batch creation is blocked
- AND no per-document jobs are queued

### Requirement: Template snapshot

The system SHALL snapshot the template version at batch start.

#### Scenario: Template changes during batch

- GIVEN a batch starts with template version 3
- WHEN staff publish template version 4 during the run
- THEN the batch continues using version 3
- AND all jobs record the same snapshot

### Requirement: Data snapshot or query record

The system SHALL record enough data context to audit what was rendered.

#### Scenario: Dataset context recorded

- GIVEN a tax receipt batch selects donors and gifts for a tax year
- WHEN the batch starts
- THEN the system records the selected period, query criteria, and data
  snapshot hash or equivalent audit context

### Requirement: Per-document jobs

Each recipient or document in a batch SHALL have a job record.

#### Scenario: One donor render failure

- GIVEN a batch contains 500 donors
- WHEN one donor render fails due to missing required data
- THEN that donor's job records the failure
- AND other donor jobs can continue

### Requirement: Queue-backed processing

Batch runs SHALL use queue-backed processing or the broader platform's existing
job system.

#### Scenario: Queue-backed rendering

- GIVEN a batch includes many annual statements
- WHEN the batch starts
- THEN per-document jobs are queued
- AND worker progress can be tracked by job state

### Requirement: Async DocRaptor rendering

Large batch runs SHALL use async DocRaptor rendering where needed.

#### Scenario: Long statement uses async rendering

- GIVEN a donor statement is expected to exceed sync render limits
- WHEN the job is submitted
- THEN the renderer uses async DocRaptor behavior
- AND the job tracks queued, working, completed, or failed state

### Requirement: Progress tracking

The UI SHALL be able to show total, pending, rendering, complete, failed,
retried, and skipped counts.

#### Scenario: Staff views progress

- GIVEN a receipt batch is running
- WHEN staff view progress
- THEN counts by job state are available
- AND failed job reasons are visible without exposing secrets

### Requirement: Retry and partial success

The system SHALL support retrying failed jobs and clearly reporting partial
success.

#### Scenario: Retry failed jobs

- GIVEN some jobs failed due to transient renderer errors
- WHEN an authorized user retries failures
- THEN only retryable jobs are retried
- AND completed jobs are not regenerated unnecessarily

#### Scenario: Partial success reported

- GIVEN a batch completes with some failed jobs
- WHEN staff view the batch summary
- THEN the system clearly reports partial success
- AND failed jobs include actionable reasons

### Requirement: Cancellation

The system SHALL support cancellation of pending work.

#### Scenario: Cancel run

- GIVEN a batch is in progress
- WHEN an authorized user cancels it
- THEN pending jobs are canceled
- AND completed, failed, and active job states remain auditable

### Requirement: Batch download

The system SHALL support batch download of generated PDFs.

#### Scenario: Download completed PDFs

- GIVEN a batch has completed documents
- WHEN an authorized user downloads the batch
- THEN the package includes completed PDFs
- AND partial failures are represented in a manifest or summary

### Requirement: Audit trail

The system SHALL log batch start, completion, failure, retry, cancellation, and
downloads.

#### Scenario: Batch download audited

- GIVEN staff download a batch package
- WHEN the download starts
- THEN the system records actor, tenant, batch id, time, and artifact set

### Requirement: Donor trust and financial safety

The system SHALL prevent silent generation of incorrect donor or financial
documents.

#### Scenario: Totals mismatch blocks job

- GIVEN an annual statement total does not match resolved donation line items
- WHEN the job validates data
- THEN the affected document fails validation
- AND no official statement is generated for that donor

#### Scenario: Batch with some missing images

- GIVEN a template references an optional image with fallback and a required
  logo without fallback
- WHEN batch preflight runs
- THEN optional image failures use approved fallback behavior
- AND the missing required logo blocks affected jobs or the batch
