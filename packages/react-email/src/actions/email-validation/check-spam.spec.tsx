import { render } from '@react-email/render';
import { VercelInviteUserEmail } from '../../../../../apps/demo/emails/notifications/vercel-invite-user';
import { checkSpam } from './check-spam';

test('checkSpam()', async () => {
  // const template = (
  //   <html>
  //     <body>
  //       This email is spam. We sell rolexss for cheap. Get your viagra. We also
  //       sell weight loss pills today. Money back guaranteed. sEnd me $500 and
  //       I'll send you back $700. don't tell anyone. Send this email to ten
  //       friends
  //     </body>
  //   </html>
  // );
  // const html = await render(template);
  // const plainText = await render(template, { plainText: true });

  const html = `<html>
  <body>
    This email is spam. We sell rolexss for cheap. Get your viagra. We also
    sell weight loss pills today. Money back guaranteed. sEnd me $500 and
    I'll send you back $700. don't tell anyone. Send this email to ten
    friends
  </body>
</html>`;
  const plainText = 'Completely different content from the original';

  console.log(await checkSpam(html, plainText));

  expect(true).toBe(false);
});
