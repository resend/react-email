import { composePdfDocumentHtml } from '@asym/pdf-renderer';
import type { DocumentContentNode } from '@asym/pdf-template-schema';
import { describe, expect, it } from 'vitest';

function doc(
  content: readonly DocumentContentNode[] = [],
): DocumentContentNode {
  return {
    type: 'doc',
    content,
  };
}

describe('Phase 09 composePdfDocumentHtml', () => {
  it('serializes paragraph nodes from structured document JSON', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Simple paragraph fixture.' }],
        },
      ]),
    });

    expect(result.html).toBe('<p>Simple paragraph fixture.</p>');
    expect(result.warnings).toEqual([]);
    expect(result.cssRequirements).toEqual([
      {
        id: 'phase-09-document-serializer',
        media: 'all',
        css: expect.stringContaining('.pdf-table'),
      },
    ]);
  });

  it('serializes heading nodes with clamped heading levels', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Quarterly Update' }],
        },
      ]),
    });

    expect(result.html).toBe('<h2>Quarterly Update</h2>');
  });

  it('serializes link marks without using raw string replacement', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Visit example',
              marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
            },
          ],
        },
      ]),
    });

    expect(result.html).toBe(
      '<p><a href="https://example.com">Visit example</a></p>',
    );
    expect(result.variables).toEqual([]);
  });

  it('serializes image nodes and collects asset references', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'image',
          attrs: {
            src: 'https://assets.example.test/logo.png',
            alt: 'Asym fixture logo',
            width: '120',
            height: '40',
            role: 'logo',
          },
        },
      ]),
    });

    expect(result.html).toBe(
      '<img alt="Asym fixture logo" class="pdf-image" height="40" src="https://assets.example.test/logo.png" width="120" />',
    );
    expect(result.assets).toEqual([
      {
        src: 'https://assets.example.test/logo.png',
        altText: 'Asym fixture logo',
        role: 'logo',
        width: '120',
        height: '40',
        path: ['content', '0'],
      },
    ]);
  });

  it('serializes button nodes as print-safe links', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'button',
          attrs: {
            href: 'https://example.com/donate',
            alignment: 'center',
          },
          content: [{ type: 'text', text: 'Donate now' }],
        },
      ]),
    });

    expect(result.html).toBe(
      '<a class="pdf-button" href="https://example.com/donate" style="text-align:center">Donate now</a>',
    );
  });

  it('serializes two-column layouts with deterministic classes', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'twoColumns',
          content: [
            {
              type: 'columnsColumn',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Column A' }],
                },
              ],
            },
            {
              type: 'columnsColumn',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Column B' }],
                },
              ],
            },
          ],
        },
      ]),
    });

    expect(result.html).toBe(
      '<div class="pdf-columns pdf-columns--2"><div class="pdf-column"><p>Column A</p></div><div class="pdf-column"><p>Column B</p></div></div>',
    );
  });

  it('serializes table nodes where supported', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  attrs: { alignment: 'left' },
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Gift' }],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: { alignment: 'right' },
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: '$25.00' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]),
    });

    expect(result.html).toBe(
      '<table class="pdf-table"><tr><th style="text-align:left"><p>Gift</p></th><td style="text-align:right"><p>$25.00</p></td></tr></table>',
    );
  });

  it('warns for unknown container nodes while rendering children', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'unknownContainer',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Still rendered.' }],
            },
          ],
        },
      ]),
    });

    expect(result.html).toBe('<p>Still rendered.</p>');
    expect(result.warnings).toMatchObject([
      {
        code: 'unknown_node',
        severity: 'warning',
        path: ['content', '0'],
        nodeType: 'unknownContainer',
      },
    ]);
  });

  it('warns for unknown leaf nodes and unknown marks', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'unsupportedLeaf',
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Marked text',
              marks: [{ type: 'sparkle' }],
            },
          ],
        },
      ]),
    });

    expect(result.html).toBe('<p>Marked text</p>');
    expect(result.warnings.map((warning) => warning.code)).toEqual([
      'unsupported_node',
      'unknown_mark',
    ]);
  });

  it('keeps style merge order deterministic', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'paragraph',
          attrs: {
            alignment: 'right',
            className: 'body-copy',
            style: {
              color: '#111827',
              textAlign: 'left',
            },
          },
          content: [{ type: 'text', text: 'Aligned copy.' }],
        },
      ]),
    });

    expect(result.html).toBe(
      '<p class="body-copy" style="color:#111827;text-align:right">Aligned copy.</p>',
    );
  });

  it('drops event handler attributes while preserving safe attributes', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'paragraph',
          attrs: {
            id: 'receipt-copy',
            className: 'body-copy',
            'aria-label': 'Receipt copy',
            'data-node-id': 'paragraph-1',
            onclick: 'alert(1)',
            onerror: 'alert(2)',
            onload: 'alert(3)',
            onmouseover: 'alert(4)',
          },
          content: [{ type: 'text', text: 'Safe copy.' }],
        },
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {
                    colSpan: 2,
                    rowSpan: 1,
                    'data-cell': 'summary',
                    onerror: 'alert(5)',
                  },
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Summary cell.' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]),
    });

    expect(result.html).toContain(
      '<p aria-label="Receipt copy" class="body-copy" data-node-id="paragraph-1" id="receipt-copy">Safe copy.</p>',
    );
    expect(result.html).toContain(
      '<td colspan="2" data-cell="summary" rowspan="1"><p>Summary cell.</p></td>',
    );
    expect(result.html).not.toContain('onclick=');
    expect(result.html).not.toContain('onerror=');
    expect(result.html).not.toContain('onload=');
    expect(result.html).not.toContain('onmouseover=');
  });

  it('returns an empty document warning for empty structured input', () => {
    const result = composePdfDocumentHtml({
      document: doc(),
    });

    expect(result.html).toBe('');
    expect(result.warnings).toMatchObject([
      {
        code: 'empty_document',
        severity: 'warning',
        path: [],
        nodeType: 'doc',
      },
    ]);
  });

  it('returns an invalid document error for invalid runtime input', () => {
    const result = composePdfDocumentHtml({
      document: null as unknown as DocumentContentNode,
    });

    expect(result).toEqual({
      html: '',
      cssRequirements: [],
      warnings: [
        {
          code: 'invalid_document',
          severity: 'error',
          message:
            'Phase 09 composePdfDocumentHtml requires a structured document node.',
          path: [],
        },
      ],
      assets: [],
      variables: [],
    });
  });

  it('collects explicit variable node usage without parsing raw merge text', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Hello {{ raw_merge_tag }} ' },
            {
              type: 'variableReference',
              attrs: {
                key: 'recipient.full_name',
                formatter: 'title',
              },
            },
          ],
        },
      ]),
    });

    expect(result.html).toBe(
      '<p>Hello {{ raw_merge_tag }} <span class="pdf-variable" data-variable-formatter="title" data-variable-key="recipient.full_name"></span></p>',
    );
    expect(result.variables).toEqual([
      {
        key: 'recipient.full_name',
        formatter: 'title',
        path: ['content', '0', 'content', '1'],
      },
    ]);
  });

  it('supports package-local custom renderers without changing built-ins', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'callout',
          content: [{ type: 'text', text: 'Custom renderer content.' }],
        },
      ]),
      nodeRenderers: [
        {
          type: 'callout',
          render: ({ childrenHtml }) =>
            `<aside class="pdf-callout">${childrenHtml}</aside>`,
        },
      ],
    });

    expect(result.html).toBe(
      '<aside class="pdf-callout">Custom renderer content.</aside>',
    );
    expect(result.warnings).toEqual([]);
  });

  it('supports package-local custom mark renderers without changing built-ins', () => {
    const result = composePdfDocumentHtml({
      document: doc([
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Highlighted copy',
              marks: [{ type: 'highlight' }],
            },
          ],
        },
      ]),
      markRenderers: [
        {
          type: 'highlight',
          render: ({ childrenHtml }) =>
            `<mark class="pdf-highlight">${childrenHtml}</mark>`,
        },
      ],
    });

    expect(result.html).toBe(
      '<p><mark class="pdf-highlight">Highlighted copy</mark></p>',
    );
    expect(result.warnings).toEqual([]);
  });
});
