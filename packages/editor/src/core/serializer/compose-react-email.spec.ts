import type { Editor, JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vitest';
import {
  composeReactEmail,
} from './compose-react-email.js';
import { DefaultBaseTemplate } from './default-base-template.js';
import type { SerializerPlugin } from './serializer-plugin.js';

const testSerializerPlugin: SerializerPlugin = {
  BaseTemplate({ previewText, children }) {
    return DefaultBaseTemplate({ previewText, children });
  },
  getNodeStyles(node) {
    switch (node.type) {
      case 'link':
        return {
          textDecoration: 'underline',
        };
      default:
        return {};
    }
  },
};

function createEditorWithContent(content: JSONContent): Editor {
  return {
    getJSON: () => content,
    extensionManager: {
      extensions: [
        {
          options: {
            serializerPlugin: testSerializerPlugin,
          },
        },
      ],
    },
  } as unknown as Editor;
}

function createDoc(content: JSONContent['content']): JSONContent {
  return {
    type: 'doc',
    content: content ?? [],
  };
}

describe('Text marks', () => {
  it('should preserve bold wrapping order when combined with italic', async () => {
    const content = createDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello world',
            marks: [{ type: 'bold' }, { type: 'italic' }],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
      source: 'template',
    });

    const strongOpen = result.html.indexOf('<strong');
    const emOpen = result.html.indexOf('<em', strongOpen);
    const emClose = result.html.indexOf('</em', emOpen);
    const strongClose = result.html.indexOf('</strong', strongOpen);
    const textIndex = result.html.indexOf('Hello world', emOpen);

    expect(strongOpen).toBeGreaterThan(-1);
    expect(emOpen).toBeGreaterThan(strongOpen);
    expect(textIndex).toBeGreaterThan(emOpen);
    expect(textIndex).toBeLessThan(emClose);
    expect(emClose).toBeGreaterThan(emOpen);
    expect(strongClose).toBeGreaterThan(emClose);
  });

  it('should keep bold outer when combined with link on text', async () => {
    const content = createDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello',
            marks: [
              { type: 'bold' },
              {
                type: 'link',
                attrs: { href: 'https://example.com' },
              },
            ],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
      source: 'template',
    });

    const strongOpen = result.html.indexOf('<strong');
    const linkOpen = result.html.indexOf('<a', strongOpen);
    const linkClose = result.html.indexOf('</a', linkOpen);
    const strongClose = result.html.indexOf('</strong', strongOpen);

    expect(strongOpen).toBeGreaterThan(-1);
    expect(result.html).toContain('href="https://example.com"');
    expect(linkOpen).toBeGreaterThan(strongOpen);
    expect(linkClose).toBeGreaterThan(linkOpen);
    expect(strongClose).toBeGreaterThan(linkClose);
  });

  it('should apply inline styles to code marks only', async () => {
    const content = createDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Code',
            attrs: { style: 'color: red; font-size: 16px;' },
            marks: [{ type: 'code' }],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
      source: 'template',
    });

    expect(result.html).toContain('<code');
    expect(result.html).toContain('</code');
    expect(result.html).toMatch(/<code[^>]*>\s*Code\s*<\/code\s*>/s);
  });

  it('should not apply inline text styles to link-only marks', async () => {
    const content = createDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Link',
            attrs: { style: 'color: red; font-size: 16px;' },
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://example.com',
                },
              },
            ],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
      source: 'template',
    });

    expect(result.html).toContain('<a');
    expect(result.html).toContain('href="https://example.com"');
    expect(result.html).not.toMatch(/color:\s*red/);
    expect(result.html).not.toMatch(/font-size:\s*16px/);
  });
});

describe('Variable with link mark', () => {
  it('should wrap variable in Link with href', async () => {
    const content = createDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'variable',
            attrs: {
              id: '{{{user_name}}}',
              fallback: 'Guest',
            },
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://example.com',
                },
              },
            ],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
      source: 'template',
    });

    expect(result.html).toContain('href="https://example.com"');
    expect(result.html).toContain('{{{user_name}}}');
  });

  it('should merge inline styles with global link styles', async () => {
    const content = createDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'variable',
            attrs: {
              id: '{{{product_name}}}',
              fallback: 'Product',
            },
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://example.com/product',
                  style: 'color: red; font-weight: bold;',
                },
              },
            ],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
      source: 'template',
    });

    expect(result.html).toContain('color:red');
    expect(result.html).toContain('font-weight:bold');
  });

  it('should preserve all link attributes', async () => {
    const content = createDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'variable',
            attrs: {
              id: '{{{link_text}}}',
              fallback: 'Click here',
            },
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://example.com',
                  rel: 'noopener',
                  target: '_blank',
                },
              },
            ],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
      source: 'template',
    });

    expect(result.html).toContain('rel="noopener"');
    expect(result.html).toContain('target="_blank"');
    expect(result.html).toContain('{{{link_text}}}');
  });

  it('should handle bold + link mark combination', async () => {
    const content = createDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'variable',
            attrs: {
              id: '{{{user_name}}}',
              fallback: 'User',
            },
            marks: [
              { type: 'bold' },
              {
                type: 'link',
                attrs: { href: 'https://example.com/profile' },
              },
            ],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
      source: 'template',
    });

    const strongOpen = result.html.indexOf('<strong');
    const linkOpen = result.html.indexOf('<a', strongOpen);
    const linkClose = result.html.indexOf('</a', linkOpen);
    const strongClose = result.html.indexOf('</strong', strongOpen);

    expect(strongOpen).toBeGreaterThan(-1);
    expect(linkOpen).toBeGreaterThan(strongOpen);
    expect(linkClose).toBeGreaterThan(linkOpen);
    expect(strongClose).toBeGreaterThan(linkClose);
    expect(result.html).toContain('href="https://example.com/profile"');
  });

  it('should handle link + code mark combination', async () => {
    const content = createDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'variable',
            attrs: {
              id: '{{{api_key}}}',
              fallback: 'YOUR_API_KEY',
            },
            marks: [
              { type: 'code' },
              {
                type: 'link',
                attrs: { href: 'https://example.com/docs' },
              },
            ],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
      source: 'template',
    });

    expect(result.html).toContain('<code');
    expect(result.html).toContain('href="https://example.com/docs"');
    expect(result.html).toContain('{{{api_key}}}');
  });

  it('should render correct variable text for broadcast source', async () => {
    const content = createDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'variable',
            attrs: {
              id: '{{{user_name}}}',
              fallback: 'Guest User',
            },
            marks: [
              {
                type: 'link',
                attrs: { href: 'https://example.com' },
              },
            ],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
      source: 'broadcast',
    });

    // Broadcast format includes fallback: {{{variable|fallback}}}
    expect(result.html).toContain('{{{user_name|Guest User}}}');
    expect(result.html).toContain('href="https://example.com"');
  });
});
