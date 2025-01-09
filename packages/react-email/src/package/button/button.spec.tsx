import { render } from '../render/node';
import { Button } from '.';

describe('<Button> component', () => {
  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Button>{testMessage}</Button>);
    expect(html).toContain(testMessage);
  });

  it('passes style and other props correctly', async () => {
    const style = { backgroundColor: 'red' };
    const html = await render(
      <Button data-testid="button-test" style={style}>
        Test
      </Button>,
    );
    expect(html).toContain('background-color:red');
    expect(html).toContain('data-testid="button-test"');
  });

  it('renders correctly  with padding values from style prop', async () => {
    const actualOutput = await render(
      <Button href="https://example.com" style={{ padding: '12px 20px' }} />,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('renders the <Button> component with no padding value', async () => {
    const actualOutput = await render(<Button href="https://example.com" />);
    expect(actualOutput).toMatchSnapshot();
  });

  it('should allow users to overwrite style props', async () => {
    const actualOutput = await render(
      <Button
        style={{
          lineHeight: '150%',
          display: 'block',
          textDecoration: 'underline red',
          maxWidth: '50%',
        }}
      />,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
