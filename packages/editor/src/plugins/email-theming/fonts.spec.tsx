import { Editor, type JSONContent, Mark } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { composeReactEmail } from '../../core/serializer/compose-react-email';
import { StarterKit } from '../../extensions';
import { EmailTheming } from './extension';
import { EMAIL_FONTS, getWebFontUrls } from './fonts';
import { EDITOR_THEMES, SUPPORTED_CSS_PROPERTIES } from './themes';

// Stand-in for `@tiptap/extension-text-style`, which only carries the attribute here.
const FontMark = Mark.create({
  name: 'textStyle',
  addAttributes: () => ({ fontFamily: { default: null } }),
  renderHTML: ({ HTMLAttributes }) => ['span', HTMLAttributes, 0],
});

const GEORGIA = "Georgia, 'Times New Roman', serif";
const INTER = "'Inter', Arial, Helvetica, sans-serif";

let editor: Editor | undefined;
afterEach(() => editor?.destroy());

function basicPanelsWithFont(bodyFont: string) {
  return EDITOR_THEMES.basic.map((group) => ({
    ...group,
    inputs: group.inputs.map((input) =>
      input.prop === 'fontFamily' ? { ...input, value: bodyFont } : input,
    ),
  }));
}

function render(bodyFont: string | undefined, content: JSONContent[] = []) {
  editor = new Editor({
    extensions: [
      StarterKit,
      FontMark,
      EmailTheming.configure({ theme: 'basic' }),
    ],
    content: {
      type: 'doc',
      content: [
        ...(bodyFont
          ? [
              {
                type: 'globalContent',
                attrs: {
                  data: {
                    theme: 'basic',
                    styles: basicPanelsWithFont(bodyFont),
                  },
                },
              },
            ]
          : []),
        { type: 'paragraph', content: [{ type: 'text', text: 'Hi' }] },
        ...content,
      ],
    },
  });
  return composeReactEmail({ editor, preview: '' }).then((r) => r.html);
}

describe('email fonts', () => {
  it('every font stack ends with a generic family', () => {
    for (const font of EMAIL_FONTS) {
      expect(font.value).toMatch(/(sans-serif|serif|monospace)$/);
    }
  });

  it('offers the list in the basic theme typography panel', () => {
    const typography = EDITOR_THEMES.basic.find((g) => g.id === 'typography');
    const input = typography?.inputs.find((i) => i.prop === 'fontFamily');
    expect(input?.options?.[GEORGIA]).toBe('Georgia');
    expect(SUPPORTED_CSS_PROPERTIES.fontFamily.type).toBe('select');
  });

  it('puts the theme font on the body cell and the container table', async () => {
    const html = await render(GEORGIA);
    const font = 'font-family:Georgia, &#x27;Times New Roman&#x27;, serif';
    expect(html).toMatch(new RegExp(`<td[^>]*${font}`));
    expect(html).toMatch(new RegExp(`<table[^>]*${font}`));
    expect(html).not.toContain('fonts.googleapis.com');
  });

  it('links a web font used as the theme font', async () => {
    const html = await render(INTER);
    expect(html).toMatch(
      /<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:/,
    );
    expect(html).not.toContain('family=Roboto');
  });

  it('links a web font set on a theme component other than the body', async () => {
    editor = new Editor({
      extensions: [StarterKit, EmailTheming.configure({ theme: 'basic' })],
      content: {
        type: 'doc',
        content: [
          {
            type: 'globalContent',
            attrs: {
              data: {
                theme: 'basic',
                styles: EDITOR_THEMES.basic.map((group) =>
                  group.id === 'h1'
                    ? {
                        ...group,
                        inputs: [
                          {
                            label: 'Font',
                            type: 'select',
                            prop: 'fontFamily',
                            classReference: 'h1',
                            value: EMAIL_FONTS[11].value,
                          },
                        ],
                      }
                    : group,
                ),
              },
            },
          },
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Title' }],
          },
        ],
      },
    });
    const { html } = await composeReactEmail({ editor, preview: '' });
    expect(EMAIL_FONTS[11].label).toBe('Open Sans');
    expect(html).toContain('family=Open+Sans');
  });

  it('links a web font used only on a text mark', async () => {
    const html = await render(undefined, [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Roboto',
            marks: [
              {
                type: 'textStyle',
                attrs: { fontFamily: EMAIL_FONTS[10].value },
              },
            ],
          },
        ],
      },
    ]);
    expect(EMAIL_FONTS[10].label).toBe('Roboto');
    expect(html).toContain('family=Roboto');
    expect(html).not.toContain('family=Inter');
  });

  it('ignores fonts that are not in the list', () => {
    expect(getWebFontUrls(['Inter', undefined, GEORGIA])).toEqual([]);
  });
});
