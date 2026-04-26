import {
  type DocumentPageSettings,
  DocumentPageSettingsSchema,
} from '@asym/pdf-template-schema';
import type {
  ComposePdfDocumentHtmlResult,
  PdfDocumentAssetReference,
  PdfDocumentCssRequirement,
  PdfDocumentRenderWarning,
  PdfDocumentVariableUsage,
} from './compose-pdf-document-html';

export interface PrintDocumentPageBox {
  readonly pageSize: DocumentPageSettings['pageSize'];
  readonly orientation: DocumentPageSettings['orientation'];
  readonly width: string;
  readonly height: string;
  readonly margins: DocumentPageSettings['margins'];
}

export interface ComposePrintDocumentHtmlInput {
  readonly title: string;
  readonly document: ComposePdfDocumentHtmlResult;
  readonly pageSettings?: DocumentPageSettings;
}

export interface ComposePrintDocumentHtmlResult {
  readonly html: string;
  readonly css: string;
  readonly cssRequirements: readonly PdfDocumentCssRequirement[];
  readonly warnings: readonly PdfDocumentRenderWarning[];
  readonly assets: readonly PdfDocumentAssetReference[];
  readonly variables: readonly PdfDocumentVariableUsage[];
  readonly page?: PrintDocumentPageBox;
}

const standardPageSizes = {
  letter: { width: '8.5in', height: '11in' },
  a4: { width: '210mm', height: '297mm' },
  legal: { width: '8.5in', height: '14in' },
} as const;

const printShellCssRequirementId = 'phase-10-print-shell';

export function composePrintDocumentHtml(
  input: ComposePrintDocumentHtmlInput,
): ComposePrintDocumentHtmlResult {
  const pageSettingsResult = DocumentPageSettingsSchema.safeParse(
    input.pageSettings ?? {},
  );

  if (!pageSettingsResult.success) {
    return {
      html: '',
      css: '',
      cssRequirements: [],
      page: undefined,
      warnings: [
        ...input.document.warnings,
        {
          code: 'invalid_page_settings',
          severity: 'error',
          message: 'Phase 10 print shell received invalid page settings.',
          path: ['pageSettings'],
          details: {
            issues: pageSettingsResult.error.issues.map((issue) => ({
              message: issue.message,
              path: issue.path,
            })),
          },
        },
      ],
      assets: input.document.assets,
      variables: input.document.variables,
    };
  }

  const page = resolvePageBox(pageSettingsResult.data);
  const shellCss = composePrintShellCss(page);
  const css = composeFullCss(input.document.cssRequirements, shellCss);
  const cssRequirements: readonly PdfDocumentCssRequirement[] = [
    ...input.document.cssRequirements,
    {
      id: printShellCssRequirementId,
      media: 'print',
      css: shellCss,
    },
  ];
  const escapedTitle = escapeHtml(input.title);
  const html = [
    '<!doctype html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    `<title>${escapedTitle}</title>`,
    `<style>${css}</style>`,
    '</head>',
    `<body><main class="asym-print-document">${input.document.html}</main></body>`,
    '</html>',
  ].join('');

  return {
    html,
    css,
    cssRequirements,
    warnings: input.document.warnings,
    assets: input.document.assets,
    variables: input.document.variables,
    page,
  };
}

function resolvePageBox(settings: DocumentPageSettings): PrintDocumentPageBox {
  const size =
    settings.pageSize === 'custom'
      ? resolveCustomPageSize(settings)
      : standardPageSizes[settings.pageSize];
  const dimensions =
    settings.orientation === 'landscape'
      ? { width: size.height, height: size.width }
      : size;

  return {
    pageSize: settings.pageSize,
    orientation: settings.orientation,
    width: dimensions.width,
    height: dimensions.height,
    margins: settings.margins,
  };
}

function resolveCustomPageSize(settings: DocumentPageSettings): {
  readonly width: string;
  readonly height: string;
} {
  const customSize = settings.customSize;

  if (!customSize) {
    return standardPageSizes.letter;
  }

  return {
    width: `${customSize.width}${customSize.unit}`,
    height: `${customSize.height}${customSize.unit}`,
  };
}

function composeFullCss(
  serializerCssRequirements: readonly PdfDocumentCssRequirement[],
  shellCss: string,
): string {
  const serializerCss = serializerCssRequirements
    .map((requirement) => requirement.css.trim())
    .filter((css) => css.length > 0)
    .join('\n');

  return serializerCss ? `${serializerCss}\n${shellCss}` : shellCss;
}

function composePrintShellCss(page: PrintDocumentPageBox): string {
  const shellCss = [
    `@page{size:${page.width} ${page.height};margin:${page.margins.top} ${page.margins.right} ${page.margins.bottom} ${page.margins.left};}`,
    `:root{--asym-page-width:${page.width};--asym-page-height:${page.height};--asym-page-margin-top:${page.margins.top};--asym-page-margin-right:${page.margins.right};--asym-page-margin-bottom:${page.margins.bottom};--asym-page-margin-left:${page.margins.left};}`,
    'html,body{margin:0;padding:0;}',
    'body{background:#ffffff;color:#111827;font-family:Arial,sans-serif;}',
    '.asym-print-document{box-sizing:border-box;}',
    '.asym-page-break{break-after:page;page-break-after:always;}',
    '.asym-page-break-before{break-before:page;page-break-before:always;}',
    '.asym-keep-together{break-inside:avoid;page-break-inside:avoid;}',
    '.asym-avoid-break-after{break-after:avoid;page-break-after:avoid;}',
    'table.asym-repeat-header thead{display:table-header-group;}',
    'table.asym-repeat-header tfoot{display:table-footer-group;}',
    '.asym-page-number::after{content:counter(page);}',
    '.asym-total-pages::after{content:counter(pages);}',
    '@media print{.asym-screen-only{display:none !important;}.asym-print-document{width:100%;}}',
  ].join('\n');

  return shellCss;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
