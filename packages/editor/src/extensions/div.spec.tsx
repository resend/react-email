import { render } from '@react-email/components';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Div } from './div';

const divStyle = { ...DEFAULT_STYLES.reset };

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
          style={divStyle}
          extension={Div}
        >
          Div content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
