import { render } from '@react-email/render';
import { CodeInline } from './index.js';

describe('<CodeInline> component', () => {
  it('renders its children once in the HTML', async () => {
    const html = await render(<CodeInline>151052</CodeInline>);
    expect(html.match(/151052/g)).toHaveLength(1);
  });

  it('renders its children once in plain text', async () => {
    const plainText = await render(
      <p>
        Your verification code is <CodeInline>151052</CodeInline>
      </p>,
      { plainText: true },
    );
    expect(plainText).toBe('Your verification code is 151052');
  });

  it('passes props to the code element', async () => {
    const html = await render(
      <CodeInline className="token" id="code" style={{ color: 'red' }}>
        npm install
      </CodeInline>,
    );
    expect(html).toContain(
      '<code class="token" id="code" style="color:red">npm install</code>',
    );
  });

  it('renders correctly', async () => {
    const actualOutput = await render(<CodeInline>npm install</CodeInline>);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><code>npm install</code><!--/$-->"`,
    );
  });
});
