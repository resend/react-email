import { render } from '@react-email/components';
import { RESET_THEMES } from '../plugins/theming/themes';
import { Div } from './div';

describe('Div Node', () => {
  it('renders React Email properly', async () => {
    const Component = Div.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'div',
            attrs: {
              class: 'div-class',
            },
          }}
          styles={{ ...RESET_THEMES.basic }}
        >
          Div content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
