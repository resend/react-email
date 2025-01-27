import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pretty } from './pretty';

describe('pretty', () => {
  it("should prettify Preview component's complex characters correctly", async () => {
    const stripeHTML = await fs.readFile(
      path.resolve(__dirname, './stripe-email.html'),
      'utf8',
    );

    expect(await pretty(stripeHTML)).toMatchSnapshot();
  });

  test('if mso syntax does not wrap', async () => {
    expect(
      await pretty(
        `<!--[if mso]><i style="mso-font-width:100%;mso-text-raise:12" hidden>&#8202;&#8202;</i><![endif]-->`,
      ),
    ).toMatchSnapshot();
  });
});
