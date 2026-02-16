import { render } from '@react-email/components';
import { RESET_THEMES } from '../plugins/theming/themes';
import { Divider } from './divider';

describe('Divider Node', () => {
  it('renders React Email properly', async () => {
    const Component = Divider.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'horizontalRule',
            attrs: {
              class: 'divider',
              style: '',
            },
          }}
          styles={{ ...RESET_THEMES.basic }}
        />,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
