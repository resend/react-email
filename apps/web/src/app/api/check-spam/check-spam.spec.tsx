import { render } from '@react-email/components';
import { checkSpam } from './check-spam';
import { StripeWelcomeEmail } from './testing/stripe-welcome-email';

const host = process.env.SPAM_ASSASSIN_HOST;
const port = process.env.SPAM_ASSASSIN_PORT;

describe.skipIf(!host || !port)('checkSpam()', { timeout: 10_000 }, () => {
  test('with most spammy email', async () => {
    const template = (
      <html lang="en">
        <body>
          This email is spam. We sell rolexss for cheap. Get your viagra. We
          also sell weight loss pills today. Money back guaranteed. sEnd me $500
          and I'll send you back $700. don't tell anyone. Send this email to ten
          friends
        </body>
      </html>
    );
    const html = await render(template);
    // const plainText = await render(template, { plainText: true });
    const plainText = 'Completely different content from the original';

    expect(await checkSpam(html, plainText)).toMatchInlineSnapshot(`
      {
        "checks": [
          {
            "description": "BODY: Money back guarantee",
            "name": "MONEY_BACK",
            "points": 1,
          },
          {
            "description": "BODY: HTML and text parts are different",
            "name": "MPART_ALT_DIFF",
            "points": 0.7,
          },
          {
            "description": "Refers to an erectile drug",
            "name": "DRUGS_ERECTILE",
            "points": 2.2,
          },
        ],
        "isSpam": false,
        "points": 3.9000000000000004,
      }
    `);
  });

  test('with stripe email template using true base url', async () => {
    const html = await render(<StripeWelcomeEmail />);
    const plainText = await render(<StripeWelcomeEmail />, {
      plainText: true,
    });

    expect(await checkSpam(html, plainText)).toMatchInlineSnapshot(`
      {
        "checks": [],
        "isSpam": false,
        "points": 0,
      }
    `);
  });
});
