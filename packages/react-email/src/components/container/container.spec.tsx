import { render } from '@react-email/render';
import { Container } from './index.js';

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

    expect(container).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:300px"><tbody><tr style="width:100%"><td><button type="button">Hi</button></td></tr></tbody></table><!--/$-->"`,
    );
  });

  it('puts padding class variants on the td with base padding (#3693)', async () => {
    const html = await render(
      <Container
        style={{ paddingLeft: '2.25rem', paddingRight: '2.25rem' }}
        className="max-sm_px-5"
      >
        hi
      </Container>,
    );
    expect(html).toMatch(/<td[^>]*class="max-sm_px-5"/);
    expect(html).toMatch(/<td[^>]*style="[^"]*padding-left:2.25rem/);
    // padding class should not only live on the outer table
    expect(html).not.toMatch(/<table[^>]*class="max-sm_px-5"/);
  });
});
