import { render } from '@react-email/render';
import { Preview, renderWhiteSpace } from './index.js';

describe('<Preview> component', () => {
  it('renders correctly', async () => {
    const actualOutput = await render(<Preview>Email preview text</Preview>);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><title>Email preview text</title><!--$--><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0" data-skip-in-text="true">Email preview text<div></div></div><!--/$-->"`,
    );
  });

  it('renders correctly with array text', async () => {
    const actualOutputArray = await render(
      <Preview>Email preview text</Preview>,
    );
    expect(actualOutputArray).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><title>Email preview text</title><!--$--><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0" data-skip-in-text="true">Email preview text<div></div></div><!--/$-->"`,
    );
  });

  it('renders correctly with really long text', async () => {
    const longText = 'really long'.repeat(100);
    const actualOutputLong = await render(<Preview>{longText}</Preview>);
    expect(actualOutputLong).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><title>really longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longre</title><!--$--><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0" data-skip-in-text="true">really longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longreally longre</div><!--/$-->"`,
    );
  });
});

describe('renderWhiteSpace', () => {
  it('renders null when text length is greater than or equal to PREVIEW_MAX_LENGTH (200)', () => {
    const text =
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore mollitia dignissimos itaque. At excepturi reiciendis iure molestias incidunt. Ab saepe, nostrum dicta dolor maiores tenetur eveniet odio amet ipsum? Lorem ipsum extra.';
    const html = renderWhiteSpace(text);
    expect(html).toBeNull();
  });

  it('emits no filler characters when text is shorter than PREVIEW_MAX_LENGTH', () => {
    const text = 'Short text';

    const html = renderWhiteSpace(text);
    expect(html).not.toBeNull();
    expect(html?.props.children).toBe('');
  });

  it('never emits zero-width filler in the rendered output', async () => {
    // Regression guard for the blank-email bug: a long run of these characters
    // near the top of <body> breaks SendGrid's click-tracking HTML rewriter,
    // which truncates the message. The HTML part arrives empty while the
    // plain-text part is fine, so it reads as intermittent. See #609, #1785, #1806.
    const output = await render(<Preview>Short text</Preview>);
    for (const char of ['\u200C', '\u200B', '\u200D', '\u200E', '\u200F', '\uFEFF']) {
      expect(output).not.toContain(char);
    }
  });
});
