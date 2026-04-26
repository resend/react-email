import {
  composePdfDocumentHtml,
  composePrintDocumentHtml,
} from '@asym/pdf-renderer';
import type {
  DocumentContentNode,
  DocumentPageSettings,
} from '@asym/pdf-template-schema';
import { describe, expect, it } from 'vitest';

function doc(
  content: readonly DocumentContentNode[] = [],
): DocumentContentNode {
  return {
    type: 'doc',
    content,
  };
}

const serializedDocument = composePdfDocumentHtml({
  document: doc([
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Phase 10 body.' }],
    },
  ]),
});

describe('Phase 10 composePrintDocumentHtml', () => {
  it('wraps serializer output in a deterministic Letter portrait shell by default', () => {
    const result = composePrintDocumentHtml({
      title: 'Donation Receipt',
      document: serializedDocument,
    });

    expect(result.warnings).toEqual([]);
    expect(result.html).toContain('<!doctype html><html>');
    expect(result.html).toContain('<title>Donation Receipt</title>');
    expect(result.html).toContain(
      '<body><main class="asym-print-document"><p>Phase 10 body.</p></main></body>',
    );
    expect(result.css).toContain(
      '@page{size:8.5in 11in;margin:0.5in 0.5in 0.5in 0.5in;}',
    );
    expect(result.css).toContain('--asym-page-width:8.5in;');
    expect(result.css).toContain('--asym-page-height:11in;');
    expect(result.cssRequirements).toEqual([
      ...serializedDocument.cssRequirements,
      {
        id: 'phase-10-print-shell',
        media: 'print',
        css: expect.stringContaining('@page{size:8.5in 11in;'),
      },
    ]);
  });

  it('supports A4 portrait page settings', () => {
    const result = composePrintDocumentHtml({
      title: 'A4 Statement',
      document: serializedDocument,
      pageSettings: {
        pageSize: 'a4',
        orientation: 'portrait',
        margins: {
          top: '1cm',
          right: '1.25cm',
          bottom: '1.5cm',
          left: '1.75cm',
        },
      },
    });

    expect(result.css).toContain(
      '@page{size:210mm 297mm;margin:1cm 1.25cm 1.5cm 1.75cm;}',
    );
    expect(result.page).toMatchObject({
      width: '210mm',
      height: '297mm',
      orientation: 'portrait',
    });
  });

  it('supports Legal landscape page settings', () => {
    const result = composePrintDocumentHtml({
      title: 'Legal Report',
      document: serializedDocument,
      pageSettings: {
        pageSize: 'legal',
        orientation: 'landscape',
        margins: {
          top: '0.75in',
          right: '0.5in',
          bottom: '0.75in',
          left: '0.5in',
        },
      },
    });

    expect(result.css).toContain(
      '@page{size:14in 8.5in;margin:0.75in 0.5in 0.75in 0.5in;}',
    );
    expect(result.page).toMatchObject({
      width: '14in',
      height: '8.5in',
      orientation: 'landscape',
    });
  });

  it('supports custom page sizes and landscape swapping', () => {
    const result = composePrintDocumentHtml({
      title: 'Certificate',
      document: serializedDocument,
      pageSettings: {
        pageSize: 'custom',
        orientation: 'landscape',
        margins: {
          top: '12mm',
          right: '10mm',
          bottom: '12mm',
          left: '10mm',
        },
        customSize: {
          width: 5,
          height: 7,
          unit: 'in',
        },
      },
    });

    expect(result.css).toContain(
      '@page{size:7in 5in;margin:12mm 10mm 12mm 10mm;}',
    );
    expect(result.page).toMatchObject({
      width: '7in',
      height: '5in',
      pageSize: 'custom',
    });
  });

  it('returns structured errors for invalid page settings', () => {
    const invalidCustomResult = composePrintDocumentHtml({
      title: 'Invalid',
      document: serializedDocument,
      pageSettings: {
        pageSize: 'custom',
        orientation: 'portrait',
        margins: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in',
        },
      } as DocumentPageSettings,
    });
    const invalidPageSizeResult = composePrintDocumentHtml({
      title: 'Invalid Size',
      document: serializedDocument,
      pageSettings: {
        pageSize: 'tabloid',
        orientation: 'portrait',
        margins: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in',
        },
      } as unknown as DocumentPageSettings,
    });

    expect(invalidCustomResult).toMatchObject({
      html: '',
      css: '',
      cssRequirements: [],
      page: undefined,
      warnings: [
        {
          code: 'invalid_page_settings',
          severity: 'error',
          path: ['pageSettings'],
        },
      ],
    });
    expect(invalidPageSizeResult.warnings).toMatchObject([
      {
        code: 'invalid_page_settings',
        severity: 'error',
        path: ['pageSettings'],
      },
    ]);
  });

  it('escapes document titles in the shell', () => {
    const result = composePrintDocumentHtml({
      title: 'Receipt <script>alert("x")</script> & Copy',
      document: serializedDocument,
    });

    expect(result.html).toContain(
      '<title>Receipt &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; Copy</title>',
    );
    expect(result.html).not.toContain('<script>');
  });

  it('emits deterministic print CSS for page controls and placeholders', () => {
    const result = composePrintDocumentHtml({
      title: 'CSS Snapshot',
      document: serializedDocument,
    });

    expect(result.css).toMatchInlineSnapshot(`
".pdf-button{display:inline-block;text-decoration:none;}
.pdf-column{box-sizing:border-box;display:table-cell;vertical-align:top;width:50%;}
.pdf-columns{box-sizing:border-box;display:table;width:100%;}
.pdf-image{max-width:100%;}
.pdf-table{border-collapse:collapse;width:100%;}
.pdf-variable{white-space:nowrap;}
@page{size:8.5in 11in;margin:0.5in 0.5in 0.5in 0.5in;}
:root{--asym-page-width:8.5in;--asym-page-height:11in;--asym-page-margin-top:0.5in;--asym-page-margin-right:0.5in;--asym-page-margin-bottom:0.5in;--asym-page-margin-left:0.5in;}
html,body{margin:0;padding:0;}
body{background:#ffffff;color:#111827;font-family:Arial,sans-serif;}
.asym-print-document{box-sizing:border-box;}
.asym-page-break{break-after:page;page-break-after:always;}
.asym-page-break-before{break-before:page;page-break-before:always;}
.asym-keep-together{break-inside:avoid;page-break-inside:avoid;}
.asym-avoid-break-after{break-after:avoid;page-break-after:avoid;}
table.asym-repeat-header thead{display:table-header-group;}
table.asym-repeat-header tfoot{display:table-footer-group;}
.asym-page-number::after{content:counter(page);}
.asym-total-pages::after{content:counter(pages);}
@media print{.asym-screen-only{display:none !important;}.asym-print-document{width:100%;}}"
`);
  });

  it('includes page control classes in the full HTML output', () => {
    const result = composePrintDocumentHtml({
      title: 'Controls',
      document: composePdfDocumentHtml({
        document: doc([
          {
            type: 'section',
            attrs: { className: 'asym-keep-together' },
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Together.' }],
              },
            ],
          },
          {
            type: 'section',
            attrs: { className: 'asym-page-break' },
          },
        ]),
      }),
    });

    expect(result.html).toContain(
      'class="pdf-document-section asym-keep-together"',
    );
    expect(result.html).toContain(
      'class="pdf-document-section asym-page-break"',
    );
    expect(result.html).toContain(
      '.asym-page-break{break-after:page;page-break-after:always;}',
    );
    expect(result.html).toContain(
      '.asym-keep-together{break-inside:avoid;page-break-inside:avoid;}',
    );
  });

  it('passes through serializer warnings, assets, and variables', () => {
    const source = composePdfDocumentHtml({
      document: doc([
        {
          type: 'image',
          attrs: {
            src: 'https://assets.example.test/logo.png',
            alt: 'Logo',
          },
        },
        {
          type: 'variableReference',
          attrs: {
            key: 'recipient.full_name',
          },
        },
        { type: 'unsupportedLeaf' },
      ]),
    });

    const result = composePrintDocumentHtml({
      title: 'Pass Through',
      document: source,
    });

    expect(result.assets).toEqual(source.assets);
    expect(result.variables).toEqual(source.variables);
    expect(result.warnings).toEqual(source.warnings);
  });
});
