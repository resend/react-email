import { render } from '@react-email/components';
import { RESET_THEMES } from '../plugins/theming/themes';
import { Heading } from './heading';

describe('Heading Node', () => {
  it('renders React Email properly', async () => {
    const Component = Heading.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'heading',
            attrs: {
              class: '',
              level: 1,
              style: '',
              ychange: null,
              alignment: 'left',
            },
          }}
          styles={{
            ...RESET_THEMES.basic,
          }}
        />,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
