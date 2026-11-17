import { Editor, type JSONContent } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { composeReactEmail } from '../../core/serializer/compose-react-email';
import { StarterKit } from '../../extensions';
import { EmailTheming } from './extension';
import { EMAIL_FONTS } from './fonts';
import { EDITOR_THEMES, SUPPORTED_CSS_PROPERTIES } from './themes';

const GEORGIA = "Georgia, 'Times New Roman', serif";

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
    extensions: [StarterKit, EmailTheming.configure({ theme: 'basic' })],
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
    expect(html).not.toMatch(/<link[^>]*fonts\.googleapis\.com/);
  });
});
