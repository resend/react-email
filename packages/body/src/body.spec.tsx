import { render } from '@react-email/render';
import { Body } from './index';
import { marginProperties, paddingProperties } from './margin-properties';

describe('<Body> component', () => {
  it('renders children correctly', async () => {
    const testMessage = 'Test message';
    const html = await render(<Body>{testMessage}</Body>);
    expect(html).toContain(testMessage);
  });

  it('passes style and other props correctly', async () => {
    const style = { backgroundColor: 'red' };
    const html = await render(
      <Body data-testid="body-test" style={style}>
        Test
      </Body>,
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="body-test"');
  });

  it('renders correctly', async () => {
    const actualOutput = await render(<Body>Lorem ipsum</Body>);
    expect(actualOutput).toMatchInlineSnapshot(
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--$--><body><table border="0" width="100%" cellPadding="0" cellSpacing="0" role="presentation" align="center"><tbody><tr><td>Lorem ipsum</td></tr></tbody></table><!--/$--></body>"`,
    );
  });

  describe('margin resetting behavior', () => {
    for (const property of marginProperties) {
      it(`should reset the ${property} property when it comes from props`, async () => {
        const actualOutput = await render(
          <Body style={{ [property]: 10 }}>Random text</Body>,
        );
        expect(actualOutput).toMatchSnapshot();
      });
    }
  });

  it('resets body padding to override client default', async () => {
    const actualOutput = await render(
      <Body style={{ padding: '20px', backgroundColor: 'pink' }}>
        Random text
      </Body>,
    );

    const bodyStyle = actualOutput.match(/<body[^>]*style="([^"]*)"/)?.[1] ?? '';
    const tdStyle = actualOutput.match(/<td[^>]*style="([^"]*)"/)?.[1] ?? '';

    expect(bodyStyle).toContain('padding:0');
    expect(bodyStyle).toContain('background-color:pink');
    expect(bodyStyle).not.toContain('padding:20px');
    expect(tdStyle).toContain('padding:20px');
  });

  describe('padding resetting behavior', () => {
    for (const property of paddingProperties) {
      it(`should reset the ${property} property on body when it comes from props`, async () => {
        const actualOutput = await render(
          <Body style={{ [property]: '10px' }}>Random text</Body>,
        );
        const kebabProperty = property.replace(
          /[A-Z]/g,
          (match) => `-${match.toLowerCase()}`,
        );
        const bodyStyle = actualOutput.match(/<body[^>]*style="([^"]*)"/)?.[1] ?? '';
        const tdStyle = actualOutput.match(/<td[^>]*style="([^"]*)"/)?.[1] ?? '';

        expect(bodyStyle).toContain(`${kebabProperty}:0`);
        expect(tdStyle).toContain(`${kebabProperty}:10px`);
      });
    }
  });
});
