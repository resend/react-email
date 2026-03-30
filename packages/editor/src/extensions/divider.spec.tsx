import { render } from '@react-email/components';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Divider } from './divider';

describe('Divider Node', () => {
  it('renders React Email properly', async () => {
    const Component = Divider.config.renderToReactEmail;
    expect(Component).toBeDefined();
    const node = {
      type: 'horizontalRule',
      attrs: {
        class: 'divider',
        style: '',
      },
    };
    expect(
      await render(
        <Component
          node={node}
          style={{ ...DEFAULT_STYLES.hr }}
          extension={Divider}
        />,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
