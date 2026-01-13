import { render } from '@react-email/render';
import { Button } from './index';

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
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><a href="https://example.com" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:12px 20px;padding-top:12px;padding-right:20px;padding-bottom:12px;padding-left:20px" target="_blank"><span><!--[if mso]><i style="mso-font-width:500%;mso-text-raise:18" hidden>&#8202;&#8202;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px"></span><span><!--[if mso]><i style="mso-font-width:500%" hidden>&#8202;&#8202;&#8203;</i><![endif]--></span></a><!--/$-->"`,
    );
  });

  it('renders the <Button> component with no padding value', async () => {
    const actualOutput = await render(<Button href="https://example.com" />);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><a href="https://example.com" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px" target="_blank"><span><!--[if mso]><i style="mso-font-width:0%;mso-text-raise:0" hidden></i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px"></span><span><!--[if mso]><i style="mso-font-width:0%" hidden>&#8203;</i><![endif]--></span></a><!--/$-->"`,
    );
  });

  it('allows users to overwrite style props', async () => {
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
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><a style="line-height:150%;text-decoration:underline red;display:block;max-width:50%;mso-padding-alt:0px" target="_blank"><span><!--[if mso]><i style="mso-font-width:0%;mso-text-raise:0" hidden></i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px"></span><span><!--[if mso]><i style="mso-font-width:0%" hidden>&#8203;</i><![endif]--></span></a><!--/$-->"`,
    );
  });
});
