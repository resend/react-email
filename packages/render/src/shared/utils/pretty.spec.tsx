import fs from 'node:fs';
import path from 'node:path';
import { render } from '../../node';
import { pretty, wrapText } from './pretty';
import { component } from '../../../../../apps/web/components/four-images-in-a-grid/inline-styles';
import { Layout } from '../../../../../apps/web/components/_components/layout';

const stripeHtml = fs.readFileSync(
  path.resolve(__dirname, './tests/stripe-email.html'),
  'utf8',
);
const codepenHtml = fs.readFileSync(
  path.resolve(__dirname, './tests/codepen-challengers.html'),
  'utf8',
);

describe('pretty', () => {
  it('should prettify base doucment correctly', () => {
    const document =
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head></head><body style="background-color:#fff;"><h1>whatever</h1><input placeholder="hello world"/></body></html>';
    expect(pretty(document, { lineBreak: '\n' })).toMatchSnapshot();
  });

  test.only('testing', async () => {
    const html = await render(<Layout>{component}</Layout>);
    await fs.promises.writeFile(
      'tailwind copy-paste component.html',
      html,
      'utf8',
    );

    console.log(pretty(html));
  it('should not wrap text inside of <style> and <script> tags', () => {
    const document = `<!DOCTYPE html><html><head><style>body { color: red; }</style></head><body><script>console.log('Hello, world!');</script></body></html>`;
    expect(pretty(document, { lineBreak: '\n' })).toMatchSnapshot();
  });

  describe('style attribute formatting', () => {
    it('should print properties per-line once they get too wide', () => {
      const document =
        '<div style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0;font-family:&quot;Google Sans&quot;"></div>';
      expect(pretty(document, { lineBreak: '\n' })).toMatchSnapshot();
    });

    it('should work with an img element', () => {
      const document =
        '<img alt="Stagg Electric Kettle" style="border-radius:12px;border:none;display:block;object-fit:cover;outline:none;text-decoration:none;width:100%;" height="288" src="/static/stagg-eletric-kettle.jpg" />';
      expect(pretty(document, { lineBreak: '\n' })).toMatchSnapshot();
    });
  });

  it("should prettify Stripe's template correctly", () => {
    expect(pretty(stripeHtml, { lineBreak: '\n' })).toMatchSnapshot();
  });

  it("should prettify Code Pen's template correctly", () => {
    expect(pretty(codepenHtml, { lineBreak: '\n' })).toMatchSnapshot();
  });

  it('should not wrap [if mso] syntax', () => {
    expect(
      pretty(
        `<span><!--[if mso]><i style="mso-font-width:100%;mso-text-raise:12" hidden>&#8202;&#8202;</i><![endif]--></span>`,
        {
          lineBreak: '\n',
        },
      ),
    ).toMatchSnapshot();
  });
});

describe('wrapText()', () => {
  it('should work with short lines', () => {
    expect(
      wrapText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tristique.',
        '',
        10,
        '\n',
      ),
    ).toMatchSnapshot();
  });

  it('should work with longer lines imitating what would come from pretty printing', () => {
    expect(
      wrapText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis laoreet tortor in orci ultricies, at fermentum nisl aliquam. Mauris ornare ut eros non vulputate. Aliquam quam massa, sagittis et nunc at, tincidunt vestibulum justo. Sed semper lectus a urna finibus congue. Aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin molestie enim sed mauris ultrices interdum.',
        '  ',
        78,
        '\n',
      ),
    ).toMatchSnapshot();
  });

  it('should work with space characters from Preview component', () => {
    const spaceCharacters = '\xa0\u200C\u200B\u200D\u200E\u200F\uFEFF'.repeat(
      150 - 50,
    );
    expect(wrapText(spaceCharacters, '', 80, '\n')).toBe(spaceCharacters);
  });

  it('should work with ending words that are larger than the max line size', () => {
    expect(
      wrapText(
        'Want to go beyond the square cube? Draw inspiration from EntropyReversed&#x27;s',
        '',
        16,
        '\n',
      ),
    ).toMatchSnapshot();
  });
});
