import { render } from '@react-email/render';
import { Section } from './index.js';

describe('<Section> component', () => {
  it('renders correctly', async () => {
    const actualOutput = await render(<Section>Lorem ipsum</Section>);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr><td>Lorem ipsum</td></tr></tbody></table><!--/$-->"`,
    );
  });

  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Section>{testMessage}</Section>);
    expect(html).toContain(testMessage);
  });

  it('passes style and other props correctly', async () => {
    const style = { backgroundColor: 'red' };
    const html = await render(
      <Section data-testid="section-test" style={style}>
        Test
      </Section>,
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="section-test"');
  });

  it('renders with <td> wrapper if no <Column> is provided', async () => {
    const actualOutput = await render(
      <Section>
        <div>Lorem ipsum</div>
      </Section>,
    );
    expect(actualOutput).toContain('<td>');
  });

  it('renders with <td> wrapper if <Column> is provided', async () => {
    const actualOutput = await render(
      <Section>
        <td>Lorem ipsum</td>
      </Section>,
    );
    expect(actualOutput).toContain('<td>');
  });

  it('renders wrapping any child provided in a <td> tag', async () => {
    const actualOutput = await render(
      <Section>
        <div>Lorem ipsum</div>
        <p>Lorem ipsum</p>
        <img alt="Lorem" src="lorem.ipsum" />
      </Section>,
    );
    const tdChildrenArr = actualOutput.match(/<td\s*.*?>.*?<\/td>/g);
    expect(tdChildrenArr).toHaveLength(1);
  });

  it('puts padding and className on the same element so responsive variants can override', async () => {
    // Before the fix: padding was moved to <td> while className stayed on <table>.
    // This meant responsive variants (on <table>) could not override base padding (on <td>).
    // After the fix: both padding and className go to <table>, so the responsive
    // variant can properly override the base class via the CSS cascade.
    const html = await render(
      <Section className="max-sm:px-5 px-9" style={{ padding: '36px' }}>
        Test
      </Section>,
    );
    // Verify padding is on <table> (same element as className), not on <td>
    expect(html).toContain('padding:36px');
    expect(html).not.toContain('<td style="padding');
  });
});
