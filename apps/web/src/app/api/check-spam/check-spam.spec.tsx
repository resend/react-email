import { render } from '@react-email/components';
import { vi } from 'vitest';
import { checkSpam } from './check-spam';
import { StripeWelcomeEmail } from './testing/stripe-welcome-email';

vi.mock('../../../utils/spam-assassin/send-to-spamd', () => ({
  sendToSpamd: async () => `
Spam detection software, running on the system "538237949377",
has identified this incoming email as possible spam.  The original message
has been attached to this so you can view it or label similar future email.
If you have any questions, see
the administrator of that system for details.

Content preview:  This email is spam. We sell rolexss for cheap. Get your viagra.
  We also sell weight loss pills today. Money back guaranteed. sEnd me $500 and
  I'll send you back $700. don't tell anyone. Send this email to ten friends

Content analysis details:   (26.2 points, 5.0 required)

 pts rule name               description
---- ---------------------- --------------------------------------------------
-0.0 RCVD_IN_DNSWL_NONE      RBL: Sender listed at https://www.dnswl.org/, no
                             trust
                            [127.0.0.1 listed in list.dnswl.org]
 5.0 MONEY_FROM_419,        Lots of money promised in a Nigeria scam
 1.0 FREEMAIL_FORGED_REPLYTO Freemail in Reply-To, but not From
 1.0 MONEY_GUARANTEE,        Lots of money promised
 0.0 HTML_MESSAGE,           BODY: HTML included in message
 1.0 ADVANCE_FEE_3_NEW,      Appears to be advanced fee fraud (Nigerian 419)
 1.0 DEAR_FRIEND,            BODY: Dear Friend? That's not a good sign
 1.0 ADVANCE_FEE_4_NEW,      Appears to be advanced fee fraud (Nigerian 419)
 1.0 FROM_NOT_REPLYTO,       From and Reply-To are different
 1.0 MONEY_BACK_GUARANTEE,   BODY: Money back guarantee
 1.0 MONEY_FROM_419_3,       Lots of money promised in a Nigeria scam
 1.0 FROM_NOT_REPLY_TO,      From and Reply-To are different
 1.0 MONEY_FROM_419_4,       Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_5,       Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_6,       Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_7,       Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_8,       Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_9,       Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_10,      Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_11,      Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_12,      Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_13,      Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_14,      Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_15,      Lots of money promised in a Nigeria scam
 1.0 MONEY_FROM_419_16,      Lots of money promised in a Nigeria scam

`,
}));

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
