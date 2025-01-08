import { render } from '../render/node';
import { Container } from '.';

describe('<Container> component', () => {
  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Container>{testMessage}</Container>);
    expect(html).toContain(testMessage);
  });

  it('passes style and other props correctly', async () => {
    const style = { maxWidth: 300, backgroundColor: 'red' };
    const html = await render(
      <Container data-testid="container-test" style={style}>
        Test
      </Container>,
    );
    expect(html).toContain('style="max-width:300px;background-color:red"');
    expect(html).toContain('data-testid="container-test"');
  });

  it('renders correctly', async () => {
    const container = await render(
      <Container style={{ maxWidth: '300px' }}>
        <button type="button">Hi</button>
      </Container>,
    );

    expect(container).toMatchSnapshot();
  });
});
