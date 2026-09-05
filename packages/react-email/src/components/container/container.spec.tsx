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

  it('puts padding and className on the same element so responsive variants can override', async () => {
    // Before the fix: padding was moved to <td> while className stayed on <table>.
    // This meant responsive variants (on <table>) could not override base padding (on <td>).
    // After the fix: both padding and className go to <table>, so the responsive
    // variant can properly override the base class via the CSS cascade.
    const html = await render(
      <Container className="max-sm:px-5 px-9" style={{ padding: '36px' }}>
        Test
      </Container>,
    );
    // Verify padding is on <table> (same element as className), not on <td>
    expect(html).toContain('padding:36px');
    expect(html).not.toContain('<td style="padding');
  });
});
