import { Editor } from '@tiptap/core';
import { render } from 'react-email';
import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Button } from './button';
import { StarterKit } from './index';

const buttonStyle = { ...DEFAULT_STYLES.reset, ...DEFAULT_STYLES.button };

describe('EditorButton Node', () => {
  let editor: Editor | null = null;

  afterEach(() => {
    editor?.destroy();
    editor = null;
  });

  it('renders React Email properly', async () => {
    const Component = Button.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'button',
            attrs: {
              class: 'button',
              href: 'https://example.com',
              alignment: 'center',
            },
          }}
          style={buttonStyle}
          extension={Button}
        >
          Click me
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('preserves href through HTML round-trip', () => {
    editor = new Editor({
      extensions: [StarterKit],
      content: {
        type: 'doc',
        content: [
          {
            type: 'container',
            content: [
              {
                type: 'button',
                attrs: { href: 'https://example.com' },
                content: [{ type: 'text', text: 'Click me' }],
              },
            ],
          },
        ],
      },
    });

    const html = editor.getHTML();
    expect(html).toContain('data-href="https://example.com"');
    expect(html).toContain('href="https://example.com"');

    editor.commands.setContent(html);

    const json = editor.getJSON();
    const findButton = (nodes: typeof json.content): typeof json | undefined =>
      nodes?.reduce<typeof json | undefined>(
        (found, n) =>
          found ?? (n.type === 'button' ? n : findButton(n.content ?? [])),
        undefined,
      );
    const buttonNode = findButton(json.content ?? []);
    expect(buttonNode?.attrs?.href).toBe('https://example.com');
  });

  it('parses data-href back to href when href attribute is missing', () => {
    editor = new Editor({ extensions: [StarterKit] });

    const htmlWithOnlyDataHref =
      '<div class="align-left"><a class="node-button button" data-id="react-email-button" data-href="https://restored.example.com">Restore me</a></div>';

    editor.commands.setContent(htmlWithOnlyDataHref);

    const json = editor.getJSON();
    const findButton = (nodes: typeof json.content): typeof json | undefined =>
      nodes?.reduce<typeof json | undefined>(
        (found, n) =>
          found ?? (n.type === 'button' ? n : findButton(n.content ?? [])),
        undefined,
      );
    const buttonNode = findButton(json.content ?? []);
    expect(buttonNode?.attrs?.href).toBe('https://restored.example.com');
  });
});
