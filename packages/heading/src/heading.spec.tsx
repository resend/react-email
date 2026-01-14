import { render } from '@react-email/render';
import { Heading } from './index';

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
