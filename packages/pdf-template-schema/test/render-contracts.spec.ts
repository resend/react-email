import {
  AuditEventSchema,
  BatchRunV1Schema,
  DocumentArtifactSchema,
  RenderErrorSchema,
  RenderJobV1Schema,
  RenderRequestSchema,
  RenderResultSchema,
  RenderWarningSchema,
} from '@asym/pdf-template-schema';
import { describe, expect, it } from 'vitest';
import { donationReceiptTemplate } from './fixtures/templates';

describe('render and audit contract schemas', () => {
  it('parses render warnings and errors with deterministic defaults', () => {
    const warning = RenderWarningSchema.parse({
      code: 'missing_optional_asset',
      message: 'Optional campaign image is missing.',
    });
    const error = RenderErrorSchema.parse({
      code: 'missing_required_variable',
      message: 'Recipient full name is required.',
    });

    expect(warning).toEqual({
      code: 'missing_optional_asset',
      message: 'Optional campaign image is missing.',
      severity: 'warning',
      path: [],
    });
    expect(error).toEqual({
      code: 'missing_required_variable',
      message: 'Recipient full name is required.',
      retryable: false,
      path: [],
    });
  });

  it('parses render requests and successful render results', () => {
    const request = RenderRequestSchema.parse({
      version: 1,
      id: 'render-request-1',
      template: donationReceiptTemplate,
      data: {
        recipient: {
          fullName: 'Jordan Lee',
        },
      },
      mode: 'preview',
    });

    const result = RenderResultSchema.parse({
      status: 'success',
      renderer: 'docraptor',
      artifact: {
        id: 'artifact-1',
        kind: 'pdf',
        mimeType: 'application/pdf',
        sizeBytes: 2048,
        storageKey: 'renders/receipt.pdf',
      },
      durationMs: 120,
    });

    expect(request.version).toBe(1);
    expect(request.renderer).toBe('docraptor');
    expect(result.warnings).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it('requires error results to carry structured errors', () => {
    expect(() =>
      RenderResultSchema.parse({
        status: 'error',
        renderer: 'docraptor',
      }),
    ).toThrow();
  });

  it('parses render job, batch run, artifact, and audit event shapes', () => {
    const artifact = DocumentArtifactSchema.parse({
      id: 'artifact-1',
      kind: 'pdf',
      mimeType: 'application/pdf',
      sizeBytes: 2048,
      storageKey: 'renders/receipt.pdf',
    });

    const job = RenderJobV1Schema.parse({
      version: 1,
      id: 'job-1',
      templateId: 'template-donation-receipt',
      templateVersion: 1,
      status: 'queued',
      mode: 'production',
      dataSnapshotHash: 'sha256:abc123',
    });

    const batch = BatchRunV1Schema.parse({
      version: 1,
      id: 'batch-1',
      templateId: 'template-donation-receipt',
      templateVersion: 1,
      status: 'queued',
      counts: {
        total: 1,
      },
    });

    const auditEvent = AuditEventSchema.parse({
      id: 'audit-1',
      eventType: 'render.started',
      occurredAt: '2026-04-25T00:00:00.000Z',
      actor: {
        type: 'system',
      },
      target: {
        type: 'render_job',
        id: 'job-1',
      },
    });

    expect(artifact.kind).toBe('pdf');
    expect(job.warnings).toEqual([]);
    expect(batch.counts.pending).toBe(0);
    expect(auditEvent.metadata).toEqual({});
  });
});
