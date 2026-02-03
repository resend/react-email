import type { JSONContent } from '@tiptap/core';
import { describe, expect, it } from 'vitest';
import { RESET_THEMES } from '../../plugins/theming/themes';
import { composeReactEmail, resolveConflictingStyles } from './to-react-email';

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

describe('Variable with link mark', () => {
  const baseStyles = {
    ...RESET_THEMES.basic,
    link: { color: 'blue', textDecoration: 'underline' },
  };

  it('should wrap variable in Link with href', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
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
      ],
    };

    const result = await composeReactEmail({
      data: content,
      styles: baseStyles,
      preview: '',
      css: '',
      source: 'template',
    });

    expect(result.html).toContain('href="https://example.com"');
    expect(result.html).toContain('{{{user_name}}}');
  });

  it('should merge inline styles with global link styles', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
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
      ],
    };

    const result = await composeReactEmail({
      data: content,
      styles: baseStyles,
      preview: '',
      css: '',
      source: 'template',
    });

    expect(result.html).toContain('color:red');
    expect(result.html).toContain('font-weight:bold');
  });

  it('should preserve all link attributes', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
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
      ],
    };

    const result = await composeReactEmail({
      data: content,
      styles: baseStyles,
      preview: '',
      css: '',
      source: 'template',
    });

    expect(result.html).toContain('rel="noopener"');
    expect(result.html).toContain('target="_blank"');
    expect(result.html).toContain('{{{link_text}}}');
  });

  it('should handle bold + link mark combination', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
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
                {
                  type: 'bold',
                },
                {
                  type: 'link',
                  attrs: {
                    href: 'https://example.com/profile',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = await composeReactEmail({
      data: content,
      styles: baseStyles,
      preview: '',
      css: '',
      source: 'template',
    });

    expect(result.html).toContain('<strong');
    expect(result.html).toContain('<a');
    expect(result.html).toContain('href="https://example.com/profile"');
    expect(result.html).toContain('{{{user_name}}}');
  });

  it('should handle link + code mark combination', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
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
                {
                  type: 'code',
                },
                {
                  type: 'link',
                  attrs: {
                    href: 'https://example.com/docs',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = await composeReactEmail({
      data: content,
      styles: {
        ...baseStyles,
        inlineCode: { fontFamily: 'monospace', backgroundColor: '#f5f5f5' },
      },
      preview: '',
      css: '',
      source: 'template',
    });

    expect(result.html).toContain('<code');
    expect(result.html).toContain('href="https://example.com/docs"');
    expect(result.html).toContain('{{{api_key}}}');
  });

  it('should render correct variable text for broadcast source', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
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
                  attrs: {
                    href: 'https://example.com',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = await composeReactEmail({
      data: content,
      styles: baseStyles,
      preview: '',
      css: '',
      source: 'broadcast',
    });

    // Broadcast format includes fallback: {{{variable|fallback}}}
    expect(result.html).toContain('{{{user_name|Guest User}}}');
    expect(result.html).toContain('href="https://example.com"');
  });
});
