import { render } from '@react-email/render';
import { Text } from './index';

describe('<Text> component', () => {
  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Text>{testMessage}</Text>);
    expect(html).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><p style="font-size:14px;line-height:24px;margin-top:16px;margin-bottom:16px">Test message</p><!--/$-->"`,
    );
  });

  it("gives priority to the user's style", async () => {
    const style = { margin: '12px', marginTop: '0px' };
    const html = await render(<Text style={style} />);
    expect(html).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><p style="font-size:14px;line-height:24px;margin:12px;margin-top:0px;margin-bottom:12px;margin-left:12px;margin-right:12px"></p><!--/$-->"`,
    );
  });

  it('passes style and other props correctly', async () => {
    const style = { fontSize: '16px' };
    const html = await render(<Text style={style}>Test</Text>);
    expect(html).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><p style="font-size:16px;line-height:24px;margin-top:16px;margin-bottom:16px">Test</p><!--/$-->"`,
    );
  });

  it('renders correctly', async () => {
    const actualOutput = await render(<Text>Lorem ipsum</Text>);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><p style="font-size:14px;line-height:24px;margin-top:16px;margin-bottom:16px">Lorem ipsum</p><!--/$-->"`,
    );
  });
});
