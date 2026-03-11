import { Link as ReactEmailLink } from '@react-email/components';
import type { JSONContent } from '@tiptap/core';
import { Editor, Node } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { coreExtensions } from '../../extensions';
import { inlineCssToJs } from '../../utils/styles';
import { composeReactEmail } from './compose-react-email';
import { EmailMark } from './email-mark';

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

/**
 * Minimal Link mark extension for testing.
 * This defines the 'link' mark type that composeReactEmail uses.
 */
const Link = EmailMark.create({
  name: 'link',
  inclusive: false,
  keepOnSplit: false,
  addAttributes() {
    return {
      href: { default: null },
      target: { default: null },
      rel: { default: null },
      style: { default: null },
      'ses:no-track': { default: null },
    };
  },
  parseHTML() {
    return [{ tag: 'a[href]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['a', HTMLAttributes, 0];
  },
  renderToReactEmail({ children, mark, style }) {
    const linkMarkStyle = mark.attrs?.style
      ? inlineCssToJs(mark.attrs.style)
      : {};

    return (
      <ReactEmailLink
        href={mark.attrs?.href ?? ''}
        rel={mark.attrs?.rel ?? undefined}
        style={{
          ...style,
          ...linkMarkStyle,
        }}
        target={mark.attrs?.target ?? undefined}
        {...(mark.attrs?.['ses:no-track'] && {
          'ses:no-track': mark.attrs['ses:no-track'],
        })}
      >
        {children}
      </ReactEmailLink>
    );
  },
});

/**
 * Minimal GlobalContent node extension for testing.
 * This defines the 'globalContent' node type used in document structure.
 */
const GlobalContent = Node.create({
  name: 'globalContent',
  group: 'block',
  parseHTML() {
    return [{ tag: 'div[data-type="globalContent"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'globalContent', ...HTMLAttributes }, 0];
  },
});

/**
 * Minimal theme data structure for testing global content.
 */
const basicTheme = {
  colors: {
    background: '#ffffff',
    foreground: '#000000',
    primary: '#000000',
    secondary: '#ffffff',
  },
  fontSize: {
    small: '14px',
    base: '16px',
    large: '18px',
  },
};

const extensions = [...coreExtensions, Link, GlobalContent];
let editor: Editor | null = null;

afterEach(() => {
  editor?.destroy();
});

function createEditorWithContent(content: JSONContent) {
  editor = new Editor({ content, extensions });
  return editor;
}

function docWithGlobalContent(
  content: JSONContent['content'],
  styles = basicTheme,
): JSONContent {
  return {
    type: 'doc',
    content: [
      {
        type: 'globalContent',
        attrs: {
          data: { styles, theme: 'basic', css: '' },
        },
      },
      ...(content ?? []),
    ],
  };
}

describe('Text marks', () => {
  it('should preserve bold wrapping order when combined with italic', async () => {
    const content = docWithGlobalContent([
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
    const content = docWithGlobalContent([
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

  it('should render uppercase marks using the extension renderer', async () => {
    const content = docWithGlobalContent([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello world',
            marks: [{ type: 'uppercase' }],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
    });

    expect(result.html).toMatch(/text-transform:\s*uppercase/i);
    expect(result.html).toContain('Hello world');
  });

  it('should render sup marks using the extension renderer', async () => {
    const content = docWithGlobalContent([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: '2',
            marks: [{ type: 'sup' }],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
    });

    expect(result.html).toContain('<sup');
    expect(result.html).toContain('>2</sup>');
  });

  it('should apply inline styles to code marks only', async () => {
    const content = docWithGlobalContent([
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
    });

    expect(result.html).toContain('<code');
    expect(result.html).toContain('</code');
    expect(result.html).toMatch(/<code[^>]*>\s*Code\s*<\/code\s*>/s);
  });

  it('should not apply inline text styles to link-only marks', async () => {
    const content = docWithGlobalContent([
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
    });

    expect(result.html).toContain('<a');
    expect(result.html).toContain('href="https://example.com"');
    expect(result.html).not.toMatch(/color:\s*red/);
    expect(result.html).not.toMatch(/font-size:\s*16px/);
  });
});

describe('StarterKit node wrappers', () => {
  it('should render bullet lists using the extension renderer', async () => {
    const content = docWithGlobalContent([
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'List item',
                  },
                ],
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
    });

    expect(result.html).toContain('<ul');
    expect(result.html).toContain('<li');
    expect(result.html).toContain('List item');
  });

  it('should render hard breaks using the extension renderer', async () => {
    const content = docWithGlobalContent([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello',
          },
          {
            type: 'hardBreak',
          },
          {
            type: 'text',
            text: 'World',
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content);
    const result = await composeReactEmail({
      editor,
      preview: '',
    });

    expect(result.html).toContain('<br');
    expect(result.html).toContain('Hello');
    expect(result.html).toContain('World');
  });
});

