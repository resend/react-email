import { render } from '@react-email/components';
import { StripeWelcomeEmail } from '../../../../../demo/emails/welcome/stripe-welcome';
import { checkSpam } from './check-spam';

describe('checkSpam()', () => {
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

  test('with real email template', async () => {
    const html = await render(<StripeWelcomeEmail />);
    const plainText = await render(<StripeWelcomeEmail />, { plainText: true });

    expect(await checkSpam(html, plainText)).toMatchSnapshot();
  });
});
