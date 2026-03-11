import { render } from '@react-email/components';
import { DEFAULT_STYLES } from '../utils/default-styles.js';
import { Body } from './body.js';

// Resolved style matching snapshot: reset only (no body-specific styles in snapshot)
const bodyStyle = { ...DEFAULT_STYLES.reset };

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
          style={bodyStyle}
        >
          Body content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
