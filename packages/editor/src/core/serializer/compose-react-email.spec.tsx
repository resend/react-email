import type { AnyExtension, JSONContent } from '@tiptap/core';
import { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { StarterKit } from '../../extensions';
import { EmailTheming } from '../../plugins/email-theming/extension';
import { composeReactEmail } from './compose-react-email';
import { EmailNode } from './email-node';

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

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

const extensions = [StarterKit];
let editor: Editor | null = null;

afterEach(() => {
  editor?.destroy();
});

function createEditorWithContent(
  content: JSONContent,
  extraExtensions: AnyExtension[] = [],
) {
  editor = new Editor({
    content,
    extensions: [...extensions, ...extraExtensions],
  });
  return editor;
}

function docWithGlobalContent(
  content: JSONContent['content'],
  styles = basicTheme,
  theme: 'basic' | 'minimal' = 'basic',
): JSONContent {
  return {
    type: 'doc',
    content: [
      {
        type: 'globalContent',
        attrs: {
          data: { styles, theme, css: '' },
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

  it('wraps custom email nodes with marks around the rendered node', async () => {
    const CustomInlineNode = EmailNode.create({
      name: 'customInlineNode',
      group: 'inline',
      inline: true,
      content: 'text*',
      marks: '_',
      renderHTML({ HTMLAttributes }) {
        return ['span', HTMLAttributes, 0];
      },
      renderToReactEmail({ children }) {
        return <span>{children}</span>;
      },
    });

    const content = docWithGlobalContent([
      {
        type: 'paragraph',
        content: [
          {
            type: 'customInlineNode',
            marks: [{ type: 'bold' }],
            content: [
              {
                type: 'text',
                text: 'Hello',
              },
            ],
          },
        ],
      },
    ]);

    const editor = createEditorWithContent(content, [CustomInlineNode]);
    const result = await composeReactEmail({
      editor,
      preview: '',
    });

    expect(result.html).toContain('<strong><span>Hello</span></strong>');
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

describe('Button and image reset styles', () => {
  it('should include display:inline-block on buttons with the basic theme', async () => {
    const content = docWithGlobalContent(
      [
        {
          type: 'button',
          attrs: { href: 'https://example.com', class: 'button' },
          content: [{ type: 'text', text: 'Click me' }],
        },
      ],
      basicTheme,
      'basic',
    );

    const ed = createEditorWithContent(content, [EmailTheming]);
    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toMatch(/display:\s*inline-block/);
    expect(result.html).toContain('Click me');
  });

  it('should include display:inline-block on buttons with the minimal theme', async () => {
    const content = docWithGlobalContent(
      [
        {
          type: 'button',
          attrs: { href: 'https://example.com', class: 'button' },
          content: [{ type: 'text', text: 'Click me' }],
        },
      ],
      basicTheme,
      'minimal',
    );

    const ed = createEditorWithContent(content, [EmailTheming]);
    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toMatch(/display:\s*inline-block/);
    expect(result.html).toContain('Click me');
  });

  it('should include line-height:100% on buttons with the minimal theme', async () => {
    const content = docWithGlobalContent(
      [
        {
          type: 'button',
          attrs: { href: 'https://example.com', class: 'button' },
          content: [{ type: 'text', text: 'Click me' }],
        },
      ],
      basicTheme,
      'minimal',
    );

    const ed = createEditorWithContent(content, [EmailTheming]);
    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toMatch(/line-height:\s*100%/);
  });

  it('should include max-width:100% on images with the basic theme', async () => {
    const ImageNode = EmailNode.create({
      name: 'image',
      group: 'block',
      atom: true,
      addAttributes() {
        return {
          src: { default: '' },
          alt: { default: '' },
        };
      },
      renderHTML({ HTMLAttributes }) {
        return ['img', HTMLAttributes];
      },
      renderToReactEmail({ style, node }) {
        return (
          <img alt={node.attrs?.alt} src={node.attrs?.src} style={style} />
        );
      },
    });

    const content = docWithGlobalContent(
      [
        {
          type: 'image',
          attrs: { src: 'https://example.com/img.png', alt: 'test image' },
        },
      ],
      basicTheme,
      'basic',
    );

    const ed = createEditorWithContent(content, [ImageNode, EmailTheming]);
    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toMatch(/max-width:\s*100%/);
    expect(result.html).toContain('test image');
  });

  it('should include max-width:100% on images with the minimal theme', async () => {
    const ImageNode = EmailNode.create({
      name: 'image',
      group: 'block',
      atom: true,
      addAttributes() {
        return {
          src: { default: '' },
          alt: { default: '' },
        };
      },
      renderHTML({ HTMLAttributes }) {
        return ['img', HTMLAttributes];
      },
      renderToReactEmail({ style, node }) {
        return (
          <img alt={node.attrs?.alt} src={node.attrs?.src} style={style} />
        );
      },
    });

    const content = docWithGlobalContent(
      [
        {
          type: 'image',
          attrs: { src: 'https://example.com/img.png', alt: 'test image' },
        },
      ],
      basicTheme,
      'minimal',
    );

    const ed = createEditorWithContent(content, [ImageNode, EmailTheming]);
    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toMatch(/max-width:\s*100%/);
    expect(result.html).toContain('test image');
  });
});
