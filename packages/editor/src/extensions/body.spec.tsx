import { render } from '@react-email/components';
import { RESET_THEMES } from '../plugins/theming/themes';
import { Body } from './body';

describe('Body Node', () => {
  it('renders React Email properly', async () => {
    const Component = Body.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'body',
            attrs: {
              class: 'body-class',
            },
          }}
          styles={{ ...RESET_THEMES.basic }}
        >
          Body content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
