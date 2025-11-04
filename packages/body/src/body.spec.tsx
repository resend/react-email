import { render } from '@react-email/render';
import { Body } from './index';
import { marginProperties } from './margin-properties';

describe('<Body> component', () => {
  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Body>{testMessage}</Body>);
    expect(html).toContain(testMessage);
  });

  it('passes style and other props correctly', async () => {
    const style = { backgroundColor: 'red' };
    const html = await render(
      <Body data-testid="body-test" style={style}>
        Test
      </Body>,
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="body-test"');
  });

  it('renders correctly', async () => {
    const actualOutput = await render(<Body>Lorem ipsum</Body>);
    expect(actualOutput).toMatchSnapshot();
  });

  describe('margin resetting behavior', () => {
    for (const property of marginProperties) {
      it(`should reset the ${property} property when it comes from props`, async () => {
        const actualOutput = await render(
          <Body style={{ [property]: 10 }}>Random text</Body>,
        );
        expect(actualOutput).toMatchSnapshot();
      });
    }
  });
});
