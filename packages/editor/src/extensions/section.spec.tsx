import { render } from 'react-email';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Section } from './section';

// Resolved style matching snapshot: section only (text-align from getTextAlignment in component)
const sectionStyle = { ...DEFAULT_STYLES.section };

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
          style={sectionStyle}
          extension={Section}
        >
          Section content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
