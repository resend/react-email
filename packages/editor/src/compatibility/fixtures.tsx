import type { AnyExtension, JSONContent } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/core';
import { EmailNode } from '../core';
import { EmailTheming } from '../plugins';
import { createImageExtension } from '../plugins/image/extension';

export const compatibilityLinkUrl = 'https://example.com';
export const compatibilityImageUrl = 'https://assets.example.test/logo.png';

export const compatibilityImageExtension = createImageExtension({
  uploadImage: async () => ({ url: compatibilityImageUrl }),
});

export const Callout = EmailNode.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-callout': '',
        style:
          'padding: 12px 16px; background: #f4f4f5; border-left: 3px solid #1c1c1c; border-radius: 4px; margin: 8px 0;',
      }),
      0,
    ];
  },

  renderToReactEmail({ children, style }) {
    return (
      <div
        style={{
          ...style,
          padding: '12px 16px',
          backgroundColor: '#f4f4f5',
          borderLeft: '3px solid #1c1c1c',
          borderRadius: '4px',
          margin: '8px 0',
        }}
      >
        {children}
      </div>
    );
  },
});

export interface CompatibilityFixture {
  readonly content: JSONContent;
  readonly description: string;
  readonly extraExtensions?: readonly AnyExtension[];
}

export const compatibilityFixtures: Record<string, CompatibilityFixture> = {
  simpleParagraph: {
    description: 'simple paragraph',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Simple paragraph fixture.' }],
        },
      ],
    },
  },
  headingAndParagraph: {
    description: 'heading and paragraph',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Quarterly Update' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'A stable paragraph follows.' }],
        },
      ],
    },
  },
  link: {
    description: 'link mark',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Visit example',
              marks: [
                {
                  type: 'link',
                  attrs: { href: compatibilityLinkUrl },
                },
              ],
            },
          ],
        },
      ],
    },
  },
  image: {
    description: 'image node',
    extraExtensions: [compatibilityImageExtension],
    content: {
      type: 'doc',
      content: [
        {
          type: 'image',
          attrs: {
            src: compatibilityImageUrl,
            alt: 'Asym fixture logo',
            width: '120',
            height: '40',
            alignment: 'center',
          },
        },
      ],
    },
  },
  button: {
    description: 'button node',
    content: {
      type: 'doc',
      content: [
        {
          type: 'button',
          attrs: {
            href: compatibilityLinkUrl,
            alignment: 'center',
            class: 'button',
          },
          content: [{ type: 'text', text: 'Donate now' }],
        },
      ],
    },
  },
  twoColumnLayout: {
    description: 'two-column layout',
    content: {
      type: 'doc',
      content: [
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
      ],
    },
  },
  table: {
    description: 'table node',
    content: {
      type: 'doc',
      content: [
        {
          type: 'table',
          attrs: { alignment: 'center', width: '600' },
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
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
      ],
    },
  },
  themedDocument: {
    description: 'themed document',
    extraExtensions: [
      EmailTheming.configure({
        theme: {
          extends: 'basic',
          styles: {
            body: { backgroundColor: '#f4f4f5' },
            button: { backgroundColor: '#0670DB', color: '#ffffff' },
            paragraph: { color: '#1f2937' },
          },
        },
      }),
    ],
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Themed intro copy.' }],
        },
        {
          type: 'button',
          attrs: {
            href: compatibilityLinkUrl,
            alignment: 'left',
            class: 'button',
          },
          content: [{ type: 'text', text: 'Open report' }],
        },
      ],
    },
  },
  customCallout: {
    description: 'custom callout extension',
    extraExtensions: [Callout],
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Before callout.' }],
        },
        {
          type: 'callout',
          content: [{ type: 'text', text: 'Custom extension content.' }],
        },
      ],
    },
  },
};
