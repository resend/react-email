import path from 'node:path';
import { getEmailComponent } from './get-email-component';

describe('getEmailComponent()', () => {
  describe('Node internals support', () => {
    test('Request', async () => {
      const result = await getEmailComponent(
        path.resolve(__dirname, './testing/request-response-email.tsx'),
        path.resolve(__dirname, '../../jsx-runtime'),
      );
      if ('error' in result) {
        console.log(result.error);
        expect('error' in result, 'there should be no errors').toBe(false);
      }
    });
  });

  test('with a demo email template', async () => {
    const result = await getEmailComponent(
      path.resolve(__dirname, './testing/vercel-invite-user.tsx'),
      path.resolve(__dirname, '../../jsx-runtime'),
    );

    if ('error' in result) {
      console.log(result.error);
      expect('error' in result).toBe(false);
    } else {
      expect(result.emailComponent).toBeTruthy();
      expect(result.sourceMapToOriginalFile).toBeTruthy();

      const emailHtml = await result.render(
        result.createElement(
          result.emailComponent,
          result.emailComponent.PreviewProps,
        ),
        {
          pretty: true,
        },
      );
      expect(emailHtml).toMatchSnapshot();
    }
  });
});
