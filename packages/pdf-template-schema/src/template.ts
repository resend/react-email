import { z } from 'zod';
import {
  ConditionalRuleSchema,
  DataBindingSchema,
  RepeaterBindingSchema,
  TableBindingSchema,
} from './bindings';
import {
  IdentifierSchema,
  IsoDateTimeSchema,
  JsonValueSchema,
  NonEmptyStringSchema,
  PositiveIntegerSchema,
  UnitLengthSchema,
  UrlSchema,
} from './primitives';
import { VariableDefinitionSchema } from './variables';

const defaultPageMargins = {
  top: '0.5in',
  right: '0.5in',
  bottom: '0.5in',
  left: '0.5in',
} as const;

const defaultThemeColors = {
  primary: '#1f2937',
  accent: '#2563eb',
  text: '#111827',
  background: '#ffffff',
} as const;

const defaultThemeFonts = {
  body: 'Arial',
  heading: 'Arial',
  fallback: ['sans-serif'],
};

export const TemplateCategorySchema = z.enum([
  'donation_receipt',
  'tax_receipt',
  'annual_giving_statement',
  'donor_letter',
  'missionary_report',
  'financial_report',
  'invoice',
  'certificate',
  'custom',
]);

export const DocumentEngineSchema = z.enum([
  'asym_pdf_document_builder',
  'unlayer',
]);

export const PageSizeSchema = z.enum(['letter', 'a4', 'legal', 'custom']);

export const PageOrientationSchema = z.enum(['portrait', 'landscape']);

export const PageUnitSchema = z.enum(['in', 'cm', 'mm', 'pt', 'px']);

export const PageMarginsSchema = z
  .object({
    top: UnitLengthSchema.default('0.5in'),
    right: UnitLengthSchema.default('0.5in'),
    bottom: UnitLengthSchema.default('0.5in'),
    left: UnitLengthSchema.default('0.5in'),
  })
  .strict()
  .default(defaultPageMargins);

export const CustomPageSizeSchema = z
  .object({
    width: PositiveIntegerSchema,
    height: PositiveIntegerSchema,
    unit: PageUnitSchema.default('in'),
  })
  .strict();

export const DocumentPageSettingsSchema = z
  .object({
    pageSize: PageSizeSchema.default('letter'),
    orientation: PageOrientationSchema.default('portrait'),
    margins: PageMarginsSchema,
    customSize: CustomPageSizeSchema.optional(),
  })
  .strict()
  .default({
    pageSize: 'letter',
    orientation: 'portrait',
    margins: defaultPageMargins,
  })
  .superRefine((settings, context) => {
    if (settings.pageSize === 'custom' && settings.customSize === undefined) {
      context.addIssue({
        code: 'custom',
        message: 'customSize is required when pageSize is custom.',
        path: ['customSize'],
      });
    }

    if (settings.pageSize !== 'custom' && settings.customSize !== undefined) {
      context.addIssue({
        code: 'custom',
        message: 'customSize can only be used when pageSize is custom.',
        path: ['customSize'],
      });
    }
  });

export type DocumentPageSettings = z.infer<typeof DocumentPageSettingsSchema>;

export const DocumentThemeSchema = z
  .object({
    name: NonEmptyStringSchema.default('Default'),
    colors: z
      .object({
        primary: NonEmptyStringSchema.default('#1f2937'),
        accent: NonEmptyStringSchema.default('#2563eb'),
        text: NonEmptyStringSchema.default('#111827'),
        background: NonEmptyStringSchema.default('#ffffff'),
      })
      .strict()
      .default(defaultThemeColors),
    fonts: z
      .object({
        body: NonEmptyStringSchema.default('Arial'),
        heading: NonEmptyStringSchema.default('Arial'),
        fallback: z.array(NonEmptyStringSchema).default(['sans-serif']),
      })
      .strict()
      .default(defaultThemeFonts),
    logoAssetId: IdentifierSchema.optional(),
    footerText: z.string().optional(),
  })
  .strict()
  .default({
    name: 'Default',
    colors: defaultThemeColors,
    fonts: defaultThemeFonts,
  });

export type DocumentTheme = z.infer<typeof DocumentThemeSchema>;

export const AssetRoleSchema = z.enum([
  'logo',
  'signature',
  'image',
  'font',
  'qr',
  'attachment',
]);

export const AssetReferenceSchema = z
  .object({
    id: IdentifierSchema,
    role: AssetRoleSchema,
    assetId: IdentifierSchema.optional(),
    url: UrlSchema.optional(),
    mimeType: NonEmptyStringSchema.optional(),
    altText: z.string().optional(),
    width: PositiveIntegerSchema.optional(),
    height: PositiveIntegerSchema.optional(),
    renderSafe: z.boolean().default(false),
  })
  .strict()
  .superRefine((asset, context) => {
    if (asset.assetId === undefined && asset.url === undefined) {
      context.addIssue({
        code: 'custom',
        message: 'Asset references require either assetId or url.',
        path: ['assetId'],
      });
    }
  });

export type AssetReference = z.infer<typeof AssetReferenceSchema>;

export const DocumentMarkSchema: z.ZodType<{
  readonly type: string;
  readonly attrs?: Record<string, unknown>;
}> = z
  .object({
    type: NonEmptyStringSchema,
    attrs: z.record(z.string(), JsonValueSchema).optional(),
  })
  .strict();

export type DocumentContentNode = {
  readonly type: string;
  readonly attrs?: Record<string, unknown>;
  readonly text?: string;
  readonly marks?: readonly z.infer<typeof DocumentMarkSchema>[];
  readonly content?: readonly DocumentContentNode[];
};

export const DocumentContentNodeSchema: z.ZodType<DocumentContentNode> = z.lazy(
  () =>
    z
      .object({
        type: NonEmptyStringSchema,
        attrs: z.record(z.string(), JsonValueSchema).optional(),
        text: z.string().optional(),
        marks: z.array(DocumentMarkSchema).optional(),
        content: z.array(DocumentContentNodeSchema).optional(),
      })
      .strict(),
);

export const DocumentContentSchema = z
  .object({
    type: z.literal('doc'),
    content: z.array(DocumentContentNodeSchema).default([]),
  })
  .strict();

export type DocumentContent = z.infer<typeof DocumentContentSchema>;

export const DocumentTemplateV1Schema = z
  .object({
    version: z.literal(1),
    id: IdentifierSchema,
    name: NonEmptyStringSchema,
    category: TemplateCategorySchema,
    engine: DocumentEngineSchema.default('asym_pdf_document_builder'),
    status: z.enum(['draft', 'published', 'archived']).default('draft'),
    pageSettings: DocumentPageSettingsSchema,
    theme: DocumentThemeSchema,
    content: DocumentContentSchema,
    variables: z.array(VariableDefinitionSchema).default([]),
    dataBindings: z.array(DataBindingSchema).default([]),
    conditionalRules: z.array(ConditionalRuleSchema).default([]),
    repeaterBindings: z.array(RepeaterBindingSchema).default([]),
    tableBindings: z.array(TableBindingSchema).default([]),
    assets: z.array(AssetReferenceSchema).default([]),
    metadata: z
      .object({
        description: z.string().optional(),
        tags: z.array(NonEmptyStringSchema).default([]),
        createdAt: IsoDateTimeSchema.optional(),
        updatedAt: IsoDateTimeSchema.optional(),
      })
      .strict()
      .default({
        tags: [],
      }),
  })
  .strict();

export type DocumentTemplateV1 = z.infer<typeof DocumentTemplateV1Schema>;
