import { generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { dracula, render } from 'react-email';
import { describe, expect, it } from 'vitest';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { CodeBlockPrism } from './code-block';
import { StyleAttribute } from './style-attribute';

// Resolved style matching snapshot: codeBlock only, no reset (theme provides padding/margin)
const codeBlockStyle = { ...DEFAULT_STYLES.codeBlock };

const importExtensions: Parameters<typeof generateJSON>[1] = [
  StarterKit.configure({
    codeBlock: false,
  }) as (typeof importExtensions)[number],
  CodeBlockPrism as (typeof importExtensions)[number],
  StyleAttribute.configure({ types: ['codeBlock'] }),
];

async function composeCodeBlock(node: {
  attrs: { language: string; theme: string; style?: string };
  code: string;
}) {
  const Component = CodeBlockPrism.config.renderToReactEmail;
  return render(
    <Component
      node={{
        type: 'codeBlock',
        attrs: node.attrs,
        content: [{ type: 'text', text: node.code }],
      }}
      style={codeBlockStyle}
      extension={CodeBlockPrism}
    />,
  );
}

describe('CodeBlockPrism Node', () => {
  it('renders React Email properly', async () => {
    const Component = CodeBlockPrism.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'codeBlock',
            attrs: { language: 'javascript', theme: 'dracula' },
            content: [{ type: 'text', text: 'const x = 1;' }],
          }}
          style={codeBlockStyle}
          extension={CodeBlockPrism}
        />,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('does not modify the theme', async () => {
    const Component = CodeBlockPrism.config.renderToReactEmail;
    expect(Component).toBeDefined();

    const originalTheme = structuredClone(dracula);
    await render(
      <Component
        node={{
          type: 'codeBlock',
          attrs: {
            language: 'javascript',
            theme: 'dracula',
          },
          content: [
            {
              type: 'text',
              text: "function helloWorld() {\n  console.log('Hello, world!');\n}",
            },
          ],
        }}
        style={codeBlockStyle}
        extension={CodeBlockPrism}
      />,
      { pretty: true },
    );
    expect(dracula).toStrictEqual(originalTheme);
  });

  it('recovers the language, the theme and the code from a composed email', async () => {
    const code =
      "function helloWorld() {\n  console.log('Hello, world!');\n}\n\nhelloWorld();";
    const html = await composeCodeBlock({
      attrs: { language: 'typescript', theme: 'dracula' },
      code,
    });

    const node = generateJSON(html, importExtensions).content?.[0];

    expect(node?.type).toBe('codeBlock');
    expect(node?.attrs?.language).toBe('typescript');
    expect(node?.attrs?.theme).toBe('dracula');
    expect(node?.content?.[0]?.text).toBe(code);
  });

  it('recovers the code when pasting normalized the encoded spaces', async () => {
    const code = "function helloWorld() {\n  console.log('Hello, world!');\n}";
    const html = (
      await composeCodeBlock({
        attrs: { language: 'javascript', theme: 'dracula' },
        code,
      })
    ).replaceAll('\u00A0\u200D\u200B', ' \u200D\u200B');

    const node = generateJSON(html, importExtensions).content?.[0];

    expect(node?.content?.[0]?.text).toBe(code);
  });

  it('keeps the resolved styles of a composed email through an import', async () => {
    const style =
      'font-family:monospace;border-radius:4px;font-weight:500;font-size:.92em';
    const composed = await composeCodeBlock({
      attrs: { language: 'javascript', theme: 'default', style },
      code: 'const x = 1;',
    });

    const node = generateJSON(composed, importExtensions).content?.[0];
    const recomposed = await composeCodeBlock({
      attrs: {
        language: node?.attrs?.language,
        theme: node?.attrs?.theme,
        style: node?.attrs?.style,
      },
      code: node?.content?.[0]?.text,
    });

    expect(recomposed).toBe(composed);
  });
});
