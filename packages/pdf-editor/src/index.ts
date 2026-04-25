import type { PdfTemplateSchemaBoundary } from '@asym/pdf-template-schema';

export type PdfEditorPackageName = '@asym/pdf-editor';
export type PdfEditorMaturity = 'phase-3-boundary';
export type PdfEditorRuntime = 'browser-react';
export type PdfEditorOwnership = 'pdf-editor';
export type PdfEditorCompatibility = 'react-email-reference-adapter';

export interface PdfEditorBoundary {
  readonly packageName: PdfEditorPackageName;
  readonly maturity: PdfEditorMaturity;
  readonly owns: PdfEditorOwnership;
  readonly runtime: PdfEditorRuntime;
  readonly compatibility: PdfEditorCompatibility;
  readonly consumes: readonly [
    PdfTemplateSchemaBoundary['packageName'],
    '@react-email/editor',
  ];
}

export const pdfEditorBoundary: PdfEditorBoundary = {
  packageName: '@asym/pdf-editor',
  maturity: 'phase-3-boundary',
  owns: 'pdf-editor',
  runtime: 'browser-react',
  compatibility: 'react-email-reference-adapter',
  consumes: ['@asym/pdf-template-schema', '@react-email/editor'],
};

export {
  ReactEmailBubbleMenuReference,
  ReactEmailEditorReference,
  ReactEmailInspectorReference,
  ReactEmailMarkReference,
  ReactEmailNodeReference,
  ReactEmailSlashCommandReference,
  ReactEmailStarterKitReference,
  ReactEmailThemingReference,
  composeReactEmailReference,
  type ReactEmailEditorReferenceProps,
  type ReactEmailEditorReferenceRef,
} from './react-email-compat';
