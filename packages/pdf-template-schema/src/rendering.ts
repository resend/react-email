import { z } from 'zod';
import {
  IdentifierSchema,
  IsoDateTimeSchema,
  JsonObjectSchema,
  NonEmptyStringSchema,
  NonNegativeIntegerSchema,
  NonNegativeNumberSchema,
  UrlSchema,
} from './primitives';
import { DocumentTemplateV1Schema } from './template';

export const RenderModeSchema = z.enum(['preview', 'production', 'batch']);

export const RendererSchema = z.enum(['docraptor', 'browser', 'local']);

export const RenderWarningSchema = z
  .object({
    code: NonEmptyStringSchema,
    message: NonEmptyStringSchema,
    severity: z.enum(['info', 'warning']).default('warning'),
    nodeId: IdentifierSchema.optional(),
    path: z.array(NonEmptyStringSchema).default([]),
    details: JsonObjectSchema.optional(),
  })
  .strict();

export type RenderWarning = z.infer<typeof RenderWarningSchema>;

export const RenderErrorSchema = z
  .object({
    code: NonEmptyStringSchema,
    message: NonEmptyStringSchema,
    retryable: z.boolean().default(false),
    nodeId: IdentifierSchema.optional(),
    path: z.array(NonEmptyStringSchema).default([]),
    details: JsonObjectSchema.optional(),
  })
  .strict();

export type RenderError = z.infer<typeof RenderErrorSchema>;

export const DocumentArtifactSchema = z
  .object({
    id: IdentifierSchema,
    kind: z.enum(['pdf', 'html', 'preview', 'manifest']),
    mimeType: NonEmptyStringSchema,
    sizeBytes: NonNegativeIntegerSchema,
    storageKey: NonEmptyStringSchema.optional(),
    url: UrlSchema.optional(),
    hash: NonEmptyStringSchema.optional(),
    createdAt: IsoDateTimeSchema.optional(),
  })
  .strict()
  .superRefine((artifact, context) => {
    if (artifact.storageKey === undefined && artifact.url === undefined) {
      context.addIssue({
        code: 'custom',
        message: 'Artifacts require either storageKey or url.',
        path: ['storageKey'],
      });
    }
  });

export type DocumentArtifact = z.infer<typeof DocumentArtifactSchema>;

export const RenderRequestSchema = z
  .object({
    version: z.literal(1),
    id: IdentifierSchema,
    template: DocumentTemplateV1Schema,
    data: JsonObjectSchema.default({}),
    mode: RenderModeSchema,
    renderer: RendererSchema.default('docraptor'),
    requestedAt: IsoDateTimeSchema.optional(),
  })
  .strict();

export type RenderRequest = z.infer<typeof RenderRequestSchema>;

export const RenderResultSchema = z
  .object({
    status: z.enum(['success', 'warning', 'error']),
    renderer: RendererSchema,
    artifact: DocumentArtifactSchema.optional(),
    warnings: z.array(RenderWarningSchema).default([]),
    errors: z.array(RenderErrorSchema).default([]),
    durationMs: NonNegativeNumberSchema.optional(),
  })
  .strict()
  .superRefine((result, context) => {
    if (result.status === 'error' && result.errors.length === 0) {
      context.addIssue({
        code: 'custom',
        message: 'Error render results must include at least one error.',
        path: ['errors'],
      });
    }
  });

export type RenderResult = z.infer<typeof RenderResultSchema>;

export const RenderJobV1Schema = z
  .object({
    version: z.literal(1),
    id: IdentifierSchema,
    templateId: IdentifierSchema,
    templateVersion: z.number().int().positive(),
    status: z.enum(['queued', 'running', 'succeeded', 'failed', 'canceled']),
    mode: RenderModeSchema,
    dataSnapshotHash: NonEmptyStringSchema,
    warnings: z.array(RenderWarningSchema).default([]),
    errors: z.array(RenderErrorSchema).default([]),
    artifacts: z.array(DocumentArtifactSchema).default([]),
    createdAt: IsoDateTimeSchema.optional(),
    updatedAt: IsoDateTimeSchema.optional(),
  })
  .strict();

export type RenderJobV1 = z.infer<typeof RenderJobV1Schema>;

export const BatchRunV1Schema = z
  .object({
    version: z.literal(1),
    id: IdentifierSchema,
    templateId: IdentifierSchema,
    templateVersion: z.number().int().positive(),
    status: z.enum([
      'draft',
      'queued',
      'running',
      'completed',
      'partial_success',
      'failed',
      'canceled',
    ]),
    dataSnapshotHash: NonEmptyStringSchema.optional(),
    jobIds: z.array(IdentifierSchema).default([]),
    counts: z
      .object({
        total: NonNegativeIntegerSchema,
        pending: NonNegativeIntegerSchema.default(0),
        running: NonNegativeIntegerSchema.default(0),
        succeeded: NonNegativeIntegerSchema.default(0),
        failed: NonNegativeIntegerSchema.default(0),
        canceled: NonNegativeIntegerSchema.default(0),
      })
      .strict(),
    createdAt: IsoDateTimeSchema.optional(),
    updatedAt: IsoDateTimeSchema.optional(),
  })
  .strict();

export type BatchRunV1 = z.infer<typeof BatchRunV1Schema>;

export const AuditEventSchema = z
  .object({
    id: IdentifierSchema,
    eventType: z.enum([
      'template.created',
      'template.updated',
      'template.published',
      'template.archived',
      'render.started',
      'render.succeeded',
      'render.failed',
      'batch.started',
      'batch.completed',
      'batch.failed',
      'artifact.downloaded',
    ]),
    occurredAt: IsoDateTimeSchema,
    actor: z
      .object({
        type: z.enum(['user', 'system']),
        id: IdentifierSchema.optional(),
      })
      .strict(),
    tenantId: IdentifierSchema.optional(),
    target: z
      .object({
        type: z.enum(['template', 'render_job', 'batch_run', 'artifact']),
        id: IdentifierSchema,
      })
      .strict(),
    metadata: JsonObjectSchema.default({}),
  })
  .strict();

export type AuditEvent = z.infer<typeof AuditEventSchema>;
