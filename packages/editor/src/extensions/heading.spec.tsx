import { render } from '@react-email/components';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Heading } from './heading';

describe('Heading Node', () => {
  it('renders React Email properly', async () => {
    const Component = Heading.config.renderToReactEmail;
    expect(Component).toBeDefined();
    const node = {
      type: 'heading',
      attrs: {
        class: '',
        level: 1,
        style: '',
        ychange: null,
        alignment: 'left',
      },
    };
    expect(
      await render(
        <Component
          node={node}
          style={{ ...DEFAULT_STYLES.reset, ...DEFAULT_STYLES.h1 }}
        />,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
