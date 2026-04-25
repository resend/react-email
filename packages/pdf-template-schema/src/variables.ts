import { z } from 'zod';
import {
  DataPathSchema,
  JsonValueSchema,
  NonEmptyStringSchema,
  VariableKeySchema,
} from './primitives';

export const VariableGroupSchema = z.enum([
  'organization',
  'recipient',
  'donation',
  'document',
  'missionary',
  'tax_receipt',
  'financial_report',
  'statement',
  'invoice',
  'asset',
  'computed',
  'custom',
]);

export const VariableValueTypeSchema = z.enum([
  'string',
  'rich_text',
  'date',
  'currency',
  'number',
  'percentage',
  'boolean',
  'address',
  'image_url',
  'url',
  'id',
]);

export const PrivacyClassificationSchema = z.enum([
  'public',
  'internal',
  'pii',
  'financial',
  'sensitive',
]);

export const FallbackBehaviorSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('none'),
  }),
  z.object({
    mode: z.literal('use_value'),
    value: JsonValueSchema,
  }),
  z.object({
    mode: z.literal('omit'),
  }),
]);

export const VariableDefinitionSchema = z
  .object({
    key: VariableKeySchema,
    label: NonEmptyStringSchema,
    group: VariableGroupSchema,
    description: NonEmptyStringSchema.optional(),
    type: VariableValueTypeSchema,
    sampleValue: JsonValueSchema,
    required: z.boolean().default(false),
    fallback: FallbackBehaviorSchema.default({ mode: 'none' }),
    formatter: NonEmptyStringSchema.optional(),
    privacy: PrivacyClassificationSchema.default('internal'),
    sourcePath: DataPathSchema.optional(),
  })
  .strict()
  .superRefine((definition, context) => {
    if (definition.required && definition.fallback.mode === 'omit') {
      context.addIssue({
        code: 'custom',
        message: 'Required variables cannot use omit fallback behavior.',
        path: ['fallback'],
      });
    }
  });

export type VariableDefinition = z.infer<typeof VariableDefinitionSchema>;

export const VariableReferenceSchema = z
  .object({
    type: z.literal('variable'),
    key: VariableKeySchema,
    formatter: NonEmptyStringSchema.optional(),
    fallback: FallbackBehaviorSchema.optional(),
  })
  .strict();

export type VariableReference = z.infer<typeof VariableReferenceSchema>;
