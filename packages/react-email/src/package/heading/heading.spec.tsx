import { render } from '../render/node';
import { Heading } from '.';

describe('render', () => {
  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Heading>{testMessage}</Heading>);
    expect(html).toContain(testMessage);
  });

  it('passes style and other props correctly', async () => {
    const style = { backgroundColor: 'red' };
    const html = await render(
      <Heading data-testid="heading-test" style={style}>
        Test
      </Heading>,
    );
    expect(html).toContain('background-color:red');
    expect(html).toContain('data-testid="heading-test"');
  });

  it('renders the <Heading> component', async () => {
    const actualOutput = await render(
      <Heading as="h2" mx={4}>
        Lorem ipsum
      </Heading>,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
