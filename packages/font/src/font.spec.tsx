import { render } from '@react-email/render';
import { Font } from './index';

describe('<Font> component', () => {
  it('renders with default props', async () => {
    const html = await render(
      <Font fallbackFontFamily="Helvetica" fontFamily="Arial" />,
    );

    expect(html).toContain('font-style: normal;');
    expect(html).toContain('font-weight: 400;');
    expect(html).toContain("font-family: 'Arial';");
  });

  it('renders with webFont prop', async () => {
    const webFont = {
      url: 'example.com/font.woff',
      format: 'woff',
    } as const;

    const html = await render(
      <Font
        fallbackFontFamily="Helvetica"
        fontFamily="Example"
        webFont={webFont}
      />,
    );

    expect(html).toContain("font-family: 'Example';");
    expect(html).toContain(
      `src: url(${webFont.url}) format('${webFont.format}');`,
    );
  });

  it('renders with multiple fallback fonts', async () => {
    const html = await render(
      <Font fallbackFontFamily={['Helvetica', 'Verdana']} fontFamily="Arial" />,
    );

    expect(html).toContain("font-family: 'Arial', Helvetica, Verdana;");
  });

  it('renders correctly', async () => {
    const actualOutput = await render(
      <Font fallbackFontFamily="Verdana" fontFamily="Roboto" />,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
