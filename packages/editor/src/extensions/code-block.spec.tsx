import { dracula, render } from '@react-email/components';
import { describe, expect, it } from 'vitest';
import { RESET_THEMES } from '../plugins/theming/themes';
import { CodeBlockPrism } from './code-block';

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
          styles={{ ...RESET_THEMES.basic }}
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
        styles={{ ...RESET_THEMES.basic }}
      />,
      { pretty: true },
    );
    expect(dracula).toStrictEqual(originalTheme);
  });
});
