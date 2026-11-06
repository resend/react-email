import { render } from '@react-email/render';
import { CodeInline } from './index.js';

describe('<CodeInline> component', () => {
  it('renders correctly', async () => {
    const actualOutput = await render(<CodeInline>npm install</CodeInline>);
    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><style>
              meta ~ .cino {
                display: none !important;
                opacity: 0 !important;
              }

              meta ~ .cio {
                display: block !important;
              }
            </style><code class=" cino">npm install</code><span class=" cio" data-skip-in-text="true" style="display:none">npm install</span><!--/$-->"
    `);
  });

  it('only includes its children once in the plain text version', async () => {
    const plainText = await render(
      <p>
        Your verification code is <CodeInline>151052</CodeInline>
      </p>,
      { plainText: true },
    );
    expect(plainText).toBe('Your verification code is 151052');
  });
});
