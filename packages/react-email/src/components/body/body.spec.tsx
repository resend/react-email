import { render } from '@react-email/render';
import { Html } from '../html/index.js';
import { Tailwind } from '../tailwind/index.js';
import { Body } from './index.js';
import { marginProperties, paddingProperties } from './margin-properties.js';

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
      `"<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><body dir="ltr" lang="en"><!--$--><!--body--><table border="0" width="100%" cellPadding="0" cellSpacing="0" role="presentation" align="center"><tbody><tr><td dir="ltr" lang="en">Lorem ipsum</td></tr></tbody></table><!--/$--></body>"`,
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

    const bodyStyle =
      actualOutput.match(/<body[^>]*style="([^"]*)"/)?.[1] ?? '';
    const tdStyle = actualOutput.match(/<td[^>]*style="([^"]*)"/)?.[1] ?? '';

    expect(bodyStyle).toContain('padding:0');
    expect(bodyStyle).toContain('background-color:pink');
    expect(bodyStyle).not.toContain('padding:20px');
    expect(tdStyle).toContain('padding:20px');
  });

  describe('lang and dir inheritance from <Html>', () => {
    const getAttributes = (html: string, tag: 'html' | 'body' | 'td') => {
      const attributes = html.match(new RegExp(`<${tag}([^>]*)>`))?.[1] ?? '';
      return {
        lang: attributes.match(/lang="([^"]*)"/)?.[1],
        dir: attributes.match(/dir="([^"]*)"/)?.[1],
      };
    };

    it('defaults to lang="en" dir="ltr" without an <Html> parent', async () => {
      const html = await render(<Body>Test</Body>);
      expect(getAttributes(html, 'body')).toEqual({ lang: 'en', dir: 'ltr' });
      expect(getAttributes(html, 'td')).toEqual({ lang: 'en', dir: 'ltr' });
    });

    it('inherits lang and dir set on <Html>', async () => {
      const html = await render(
        <Html lang="ar" dir="rtl">
          <Body>Test</Body>
        </Html>,
      );
      expect(getAttributes(html, 'body')).toEqual({ lang: 'ar', dir: 'rtl' });
      expect(getAttributes(html, 'td')).toEqual({ lang: 'ar', dir: 'rtl' });
    });

    it("inherits <Html>'s defaults when it has no explicit lang/dir", async () => {
      const html = await render(
        <Html>
          <Body>Test</Body>
        </Html>,
      );
      expect(getAttributes(html, 'body')).toEqual({ lang: 'en', dir: 'ltr' });
    });

    it('lets explicit lang and dir on <Body> win over <Html>', async () => {
      const html = await render(
        <Html lang="pl">
          <Body lang="en" dir="rtl">
            Test
          </Body>
        </Html>,
      );
      expect(getAttributes(html, 'html')).toEqual({ lang: 'pl', dir: 'ltr' });
      expect(getAttributes(html, 'body')).toEqual({ lang: 'en', dir: 'rtl' });
    });

    it('inherits lang and dir through custom components', async () => {
      const Content = ({ children }: { children: React.ReactNode }) => {
        return <Body>{children}</Body>;
      };
      const Layout = ({ children }: { children: React.ReactNode }) => {
        return <Content>{children}</Content>;
      };

      const html = await render(
        <Html lang="pl">
          <Layout>Cześć</Layout>
        </Html>,
      );
      expect(getAttributes(html, 'body')).toEqual({ lang: 'pl', dir: 'ltr' });
      expect(getAttributes(html, 'td')).toEqual({ lang: 'pl', dir: 'ltr' });
    });

    it('inherits lang and dir with <Tailwind> in between', async () => {
      const html = await render(
        <Html lang="pl">
          <Tailwind>
            <Body className="bg-red-500">Cześć</Body>
          </Tailwind>
        </Html>,
      );
      expect(getAttributes(html, 'body')).toEqual({ lang: 'pl', dir: 'ltr' });
      expect(html).toContain('background-color');
    });

    it('inherits lang and dir with <Tailwind> around <Html>', async () => {
      const html = await render(
        <Tailwind>
          <Html lang="pl">
            <Body className="bg-red-500">Cześć</Body>
          </Html>
        </Tailwind>,
      );
      expect(getAttributes(html, 'body')).toEqual({ lang: 'pl', dir: 'ltr' });
      expect(html).toContain('background-color');
    });

    it('does not leak the private context prop into the markup', async () => {
      const html = await render(
        <Html lang="pl">
          <Body>Test</Body>
        </Html>,
      );
      expect(html.toLowerCase()).not.toContain('reactemailcontexts');
    });
  });

  describe('padding resetting behavior', () => {
    for (const property of paddingProperties) {
      it(`resets the ${property} property on body when it comes from props`, async () => {
        const actualOutput = await render(
          <Body style={{ [property]: '10px' }}>Random text</Body>,
        );
        const kebabProperty = property.replace(
          /[A-Z]/g,
          (match) => `-${match.toLowerCase()}`,
        );
        const bodyStyle =
          actualOutput.match(/<body[^>]*style="([^"]*)"/)?.[1] ?? '';
        const tdStyle =
          actualOutput.match(/<td[^>]*style="([^"]*)"/)?.[1] ?? '';

        expect(bodyStyle).toContain(`${kebabProperty}:0`);
        expect(tdStyle).toContain(`${kebabProperty}:10px`);
      });
    }
  });
});
