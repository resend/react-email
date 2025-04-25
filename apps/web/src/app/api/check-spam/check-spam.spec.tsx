import { render } from '@react-email/components';
import { checkSpam } from './check-spam';
import { StripeWelcomeEmail } from './testing/stripe-welcome-email';

describe('checkSpam()', { timeout: 10_000 }, () => {
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

    expect(await checkSpam(html, plainText)).toMatchSnapshot();
  });

  test('with stripe email template using true base url', async () => {
    const html = await render(<StripeWelcomeEmail />);
    const plainText = await render(<StripeWelcomeEmail />, {
      plainText: true,
    });

    expect(await checkSpam(html, plainText)).toMatchSnapshot();
  });
});
