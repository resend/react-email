import { render } from '@react-email/components';
import { RESET_THEMES } from '../plugins/theming/themes';
import { Section } from './section';

describe('Section Node', () => {
  it('renders React Email properly', async () => {
    const Component = Section.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'section',
            attrs: {
              class: 'node-section',
              alignment: 'center',
            },
          }}
          styles={{ ...RESET_THEMES.basic }}
        >
          Section content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
