import { dracula, render } from '@react-email/components';
import { describe, expect, it } from 'vitest';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { CodeBlockPrism } from './code-block';

// Resolved style matching snapshot: codeBlock only, no reset (theme provides padding/margin)
const codeBlockStyle = { ...DEFAULT_STYLES.codeBlock };

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
      />,
      { pretty: true },
    );
    expect(dracula).toStrictEqual(originalTheme);
  });
});
