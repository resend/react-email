import { render } from '@react-email/components';
import { DEFAULT_STYLES } from '../utils/default-styles.js';
import { Button } from './button.js';

const buttonStyle = { ...DEFAULT_STYLES.reset, ...DEFAULT_STYLES.button };

describe('EditorButton Node', () => {
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
        >
          Click me
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
