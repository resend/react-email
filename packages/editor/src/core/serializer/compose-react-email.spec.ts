import type { JSONContent } from '@tiptap/core';
import { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { coreExtensions } from '../../extensions';
import { resolveConflictingStyles } from '../../utils/styles';
// import { EmailTheming } from '../../plugins/email-theming/extension';
// import { EDITOR_THEMES } from '../../plugins/email-theming/themes';
// import { Variable } from '../../plugins/variables/extension';
import { composeReactEmail } from './compose-react-email';

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

const extensions = [...coreExtensions];
let editor: Editor | null = null;

afterEach(() => {
  editor?.destroy();
});

function createEditorWithContent(content: JSONContent) {
  editor = new Editor({ content, extensions });
  return editor;
}

// function docWithGlobalContent(
//   content: JSONContent['content'],
//   styles = EDITOR_THEMES.basic,
// ): JSONContent {
//   return {
//     type: 'doc',
//     content: [
//       {
//         type: 'globalContent',
//         attrs: {
//           data: { styles, theme: 'basic', css: '' },
//         },
//       },
//       ...(content ?? []),
//     ],
//   };
// }

describe('resolveConflictingStyles', () => {
  describe('basic functionality', () => {
    it('should merge reset styles with inline styles', () => {
      const resetStyles = { margin: '0', padding: '0' };
      const inlineStyles = { color: 'red' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
        color: 'red',
      });
    });

    it('should allow inline styles to override expanded reset styles', () => {
      const resetStyles = { margin: '0' };
      const inlineStyles = { marginTop: '10px' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
      });
    });
  });

  describe('margin conflicts', () => {
    it('should resolve margin auto centering conflict', () => {
      const resetStyles = { margin: '0' };
      const inlineStyles = { marginLeft: 'auto', marginRight: 'auto' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '0',
        marginLeft: 'auto',
      });
    });

    it('should allow partial margin overrides', () => {
      const resetStyles = { margin: '0' };
      const inlineStyles = { marginTop: '20px', marginBottom: '20px' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '20px',
        marginRight: '0',
        marginBottom: '20px',
        marginLeft: '0',
      });
    });

    it('should handle margin with multiple values in reset', () => {
      const resetStyles = { margin: '10px 20px' };
      const inlineStyles = { marginLeft: 'auto' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '20px',
        marginBottom: '10px',
        marginLeft: 'auto',
      });
    });
  });

  describe('padding conflicts', () => {
    it('should resolve padding conflicts', () => {
      const resetStyles = { padding: '0' };
      const inlineStyles = { paddingTop: '15px', paddingBottom: '15px' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        paddingTop: '15px',
        paddingRight: '0',
        paddingBottom: '15px',
        paddingLeft: '0',
      });
    });

    it('should handle padding with multiple values in reset', () => {
      const resetStyles = { padding: '5px 10px' };
      const inlineStyles = { paddingLeft: '20px' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        paddingTop: '5px',
        paddingRight: '10px',
        paddingBottom: '5px',
        paddingLeft: '20px',
      });
    });
  });

  describe('mixed properties', () => {
    it('should handle both margin and padding conflicts', () => {
      const resetStyles = { margin: '0', padding: '0' };
      const inlineStyles = {
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: '10px',
      };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '0',
        marginLeft: 'auto',
        paddingTop: '10px',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
      });
    });

    it('should preserve non-spacing properties from both sources', () => {
      const resetStyles = {
        margin: '0',
        padding: '0',
        fontSize: '16px',
      };
      const inlineStyles = {
        marginTop: '10px',
        color: 'blue',
        backgroundColor: 'white',
      };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
        fontSize: '16px',
        color: 'blue',
        backgroundColor: 'white',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty inline styles', () => {
      const resetStyles = { margin: '0', padding: '0' };
      const inlineStyles = {};

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
      });
    });

    it('should handle reset styles without shorthand properties', () => {
      const resetStyles = { fontSize: '16px', lineHeight: '1.5' };
      const inlineStyles = { color: 'red' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        fontSize: '16px',
        lineHeight: '1.5',
        color: 'red',
      });
    });

    it('should handle inline styles overriding non-spacing properties', () => {
      const resetStyles = { margin: '0', fontSize: '16px' };
      const inlineStyles = { fontSize: '20px' };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        fontSize: '20px',
      });
    });
  });

  describe('real-world email scenarios', () => {
    it('should handle centered button with margin auto', () => {
      const resetStyles = { margin: '0', padding: '0' };
      const inlineStyles = {
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '24px',
        paddingRight: '24px',
      };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '0',
        marginLeft: 'auto',
        paddingTop: '12px',
        paddingRight: '24px',
        paddingBottom: '12px',
        paddingLeft: '24px',
      });
    });

    it('should handle section with custom spacing', () => {
      const resetStyles = { margin: '0', padding: '0' };
      const inlineStyles = {
        paddingTop: '20px',
        paddingBottom: '20px',
        marginTop: '10px',
      };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '10px',
        marginRight: '0',
        marginBottom: '0',
        marginLeft: '0',
        paddingTop: '20px',
        paddingRight: '0',
        paddingBottom: '20px',
        paddingLeft: '0',
      });
    });

    it('should handle complex reset with multiple properties', () => {
      const resetStyles = {
        margin: '0',
        padding: '0',
        fontSize: '16px',
        lineHeight: '1.5',
        fontWeight: 400,
      };
      const inlineStyles = {
        marginLeft: 'auto',
        marginRight: 'auto',
        fontSize: '18px',
      };

      const result = resolveConflictingStyles(resetStyles, inlineStyles);

      expect(result).toEqual({
        marginTop: '0',
        marginRight: 'auto',
        marginBottom: '0',
        marginLeft: 'auto',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
        fontSize: '18px',
        lineHeight: '1.5',
        fontWeight: 400,
      });
    });
  });
});

describe('Text marks', () => {
  it('should preserve bold wrapping order when combined with italic', async () => {
    const content = [
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
    ];

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
    const content = [
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
    ];

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
    const content = [
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
    ];

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
    const content = [
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
    ];

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
    const content = [
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
    ];

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
    const content = [
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
    ];

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
    const content = [
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
    ];

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
    const content = [
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
    ];

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
    const content = [
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
    ];

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
    const content = [
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
    ];

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
