import fs from 'node:fs';
import path from 'node:path';
import { lenientParse, pretty, wrapText } from './pretty';

const stripeHTML = fs.readFileSync(
  path.resolve(__dirname, './stripe-email.html'),
  'utf8',
);

describe('lenientParse()', () => {
  it('should parse base doucment correctly', () => {
    const document = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head></head><body style="background-color:#fff;"><h1>whatever</h1><input placeholder="hello world"/></body></html>`;
    expect(lenientParse(document)).toMatchSnapshot();
  });
});

describe('pretty', () => {
  it('should prettify base doucment correctly', () => {
    const document =
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html><head></head><body style="background-color:#fff;"><h1>whatever</h1><input placeholder="hello world"/></body></html>';
    expect(pretty(document, { lineBreak: '\n' })).toMatchSnapshot();
  });

  it('should print properties per-line once they get too wide', () => {
    const document =
      '<div style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#e6ebf1;margin:20px 0"></div>';
    expect(pretty(document, { lineBreak: '\n' })).toMatchSnapshot();
  });

  it("should prettify Preview component's complex characters correctly", () => {
    expect(pretty(stripeHTML, { lineBreak: '\n' })).toMatchSnapshot();
  });

  // test('if mso syntax does not wrap', async () => {
  //   expect(
  //     await pretty(
  //       `<span><!--[if mso]><i style="mso-font-width:100%;mso-text-raise:12" hidden>&#8202;&#8202;</i><![endif]--></span>`,
  //     ),
  //   ).toMatchSnapshot();
  // });
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
});
