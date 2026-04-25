export type PdfTemplateSchemaPackageName = '@asym/pdf-template-schema';
export type PdfTemplateSchemaMaturity = 'phase-6-schema-foundation';
export type PdfTemplateSchemaRuntime = 'shared';
export type PdfTemplateSchemaOwnership = 'template-schema';

export interface PdfTemplateSchemaBoundary {
  readonly packageName: PdfTemplateSchemaPackageName;
  readonly maturity: PdfTemplateSchemaMaturity;
  readonly owns: PdfTemplateSchemaOwnership;
  readonly runtime: PdfTemplateSchemaRuntime;
}

export const pdfTemplateSchemaBoundary: PdfTemplateSchemaBoundary = {
  packageName: '@asym/pdf-template-schema',
  maturity: 'phase-6-schema-foundation',
  owns: 'template-schema',
  runtime: 'shared',
};

export {
  ConditionalOperatorSchema,
  type ConditionalRule,
  ConditionalRuleSchema,
  type DataBinding,
  DataBindingSchema,
  type RepeaterBinding,
  RepeaterBindingSchema,
  type TableBinding,
  TableBindingSchema,
  TableColumnBindingSchema,
} from './bindings';

export {
  type AuditEvent,
  AuditEventSchema,
  type BatchRunV1,
  BatchRunV1Schema,
  type DocumentArtifact,
  DocumentArtifactSchema,
  type RenderError,
  RenderErrorSchema,
  RendererSchema,
  type RenderJobV1,
  RenderJobV1Schema,
  RenderModeSchema,
  type RenderRequest,
  RenderRequestSchema,
  type RenderResult,
  RenderResultSchema,
  type RenderWarning,
  RenderWarningSchema,
} from './rendering';

export {
  type AssetReference,
  AssetReferenceSchema,
  AssetRoleSchema,
  CustomPageSizeSchema,
  type DocumentContent,
  type DocumentContentNode,
  DocumentContentNodeSchema,
  DocumentContentSchema,
  DocumentEngineSchema,
  type DocumentPageSettings,
  DocumentPageSettingsSchema,
  type DocumentTemplateV1,
  DocumentTemplateV1Schema,
  type DocumentTheme,
  DocumentThemeSchema,
  PageMarginsSchema,
  PageOrientationSchema,
  PageSizeSchema,
  PageUnitSchema,
  TemplateCategorySchema,
} from './template';

export {
  FallbackBehaviorSchema,
  PrivacyClassificationSchema,
  type VariableDefinition,
  VariableDefinitionSchema,
  VariableGroupSchema,
  type VariableReference,
  VariableReferenceSchema,
  VariableValueTypeSchema,
} from './variables';
