import { z } from 'zod';
import {
  DataPathSchema,
  IdentifierSchema,
  JsonValueSchema,
  NonEmptyStringSchema,
  NonNegativeIntegerSchema,
  PositiveIntegerSchema,
  VariableKeySchema,
} from './primitives';

export const DataBindingSchema = z
  .object({
    id: IdentifierSchema,
    variableKey: VariableKeySchema,
    sourcePath: DataPathSchema,
    required: z.boolean().default(false),
  })
  .strict();

export type DataBinding = z.infer<typeof DataBindingSchema>;

export const ConditionalOperatorSchema = z.enum([
  'exists',
  'not_exists',
  'equals',
  'not_equals',
  'greater_than',
  'less_than',
  'contains',
  'is_empty',
  'is_not_empty',
]);

const operatorsWithoutValue = new Set([
  'exists',
  'not_exists',
  'is_empty',
  'is_not_empty',
]);

export const ConditionalRuleSchema = z
  .object({
    id: IdentifierSchema.optional(),
    fieldPath: DataPathSchema,
    operator: ConditionalOperatorSchema,
    value: JsonValueSchema.optional(),
  })
  .strict()
  .superRefine((rule, context) => {
    const acceptsValue = !operatorsWithoutValue.has(rule.operator);

    if (acceptsValue && rule.value === undefined) {
      context.addIssue({
        code: 'custom',
        message: `Operator "${rule.operator}" requires a comparison value.`,
        path: ['value'],
      });
    }

    if (!acceptsValue && rule.value !== undefined) {
      context.addIssue({
        code: 'custom',
        message: `Operator "${rule.operator}" must not define a value.`,
        path: ['value'],
      });
    }
  });

export type ConditionalRule = z.infer<typeof ConditionalRuleSchema>;

export const RepeaterBindingSchema = z
  .object({
    id: IdentifierSchema,
    sourcePath: DataPathSchema,
    itemAlias: VariableKeySchema,
    emptyState: NonEmptyStringSchema.optional(),
    maxItems: PositiveIntegerSchema.max(1000).default(1000),
    sort: z
      .object({
        fieldPath: DataPathSchema,
        direction: z.enum(['asc', 'desc']).default('asc'),
      })
      .strict()
      .optional(),
  })
  .strict();

export type RepeaterBinding = z.infer<typeof RepeaterBindingSchema>;

export const TableColumnBindingSchema = z
  .object({
    key: IdentifierSchema,
    label: NonEmptyStringSchema,
    sourcePath: DataPathSchema,
    formatter: NonEmptyStringSchema.optional(),
    width: NonEmptyStringSchema.optional(),
    align: z.enum(['left', 'center', 'right']).default('left'),
  })
  .strict();

export const TableBindingSchema = z
  .object({
    id: IdentifierSchema,
    sourcePath: DataPathSchema,
    columns: z.array(TableColumnBindingSchema).min(1),
    emptyState: NonEmptyStringSchema.optional(),
    repeatHeader: z.boolean().default(true),
    maxRows: NonNegativeIntegerSchema.max(5000).default(5000),
    totals: z
      .array(
        z
          .object({
            columnKey: IdentifierSchema,
            operation: z.enum(['sum', 'count']),
            label: NonEmptyStringSchema.optional(),
          })
          .strict(),
      )
      .default([]),
  })
  .strict();

export type TableBinding = z.infer<typeof TableBindingSchema>;
