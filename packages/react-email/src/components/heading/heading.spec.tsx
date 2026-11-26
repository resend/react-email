import { render } from '@react-email/render';
import { Heading } from './index.js';

describe('render', () => {
  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Heading>{testMessage}</Heading>);
    expect(html).toContain(testMessage);
  });

  it('passes style and other props correctly', async () => {
    const style = { backgroundColor: 'red' };
    const html = await render(
      <Heading data-testid="heading-test" style={style}>
        Test
      </Heading>,
    );
    expect(html).toContain('background-color:red');
    expect(html).toContain('data-testid="heading-test"');
  });

  it.each([
    [{ mt: '1.5rem' }, 'margin-top:1.5rem'],
    [{ mb: '10px' }, 'margin-bottom:10px'],
    [{ m: 'auto' }, 'margin:auto'],
    [{ m: '0 auto' }, 'margin:0px auto'],
    [{ m: '0 10' }, 'margin:0px 10px'],
    [{ m: '10 1.5rem auto' }, 'margin:10px 1.5rem auto'],
  ])('renders the margin shortcut %o as %s', async (margin, expectedStyle) => {
    const html = await render(<Heading {...margin}>Hello</Heading>);
    expect(html).toContain(`style="${expectedStyle}"`);
  });

  it('drops multiple values on single-side margin shortcuts', async () => {
    const html = await render(<Heading mx="0 auto">Hello</Heading>);
    expect(html).toContain('<h1>Hello</h1>');
  });

  it('renders the <Heading> component', async () => {
    const actualOutput = await render(
      <Heading as="h2" mx={4}>
        Lorem ipsum
      </Heading>,
    );
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><h2 style="margin-left:4px;margin-right:4px">Lorem ipsum</h2><!--/$-->"`,
    );
  });
});
