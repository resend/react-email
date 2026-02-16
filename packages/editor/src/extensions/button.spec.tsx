import { render } from '@react-email/components';
import { RESET_THEMES } from '../plugins/theming/themes';
import { EditorButton } from './editor-button';

describe('EditorButton Node', () => {
  it('renders React Email properly', async () => {
    const Component = EditorButton.config.renderToReactEmail;
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
          styles={{ ...RESET_THEMES.basic }}
        >
          Click me
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
