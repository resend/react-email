import path from 'node:path';
import {
  buildEmailComponent,
  getEmailComponent,
} from '../actions/build-email-component';
import * as EnvExports from '../app/env';
import { isErr, isOk } from '../utils/result';

function mockEnv(emailsDirectoryAbsolutePath: string) {
  vi.resetModules();
  vi.spyOn(EnvExports, 'emailsDirectoryAbsolutePath', 'get').mockReturnValue(
    emailsDirectoryAbsolutePath,
  );
}

describe('getEmailComponent()', () => {
  describe('Node internals support', () => {
    const emailSlug = 'request-response-email';
    beforeAll(() => {
      mockEnv(path.resolve(__dirname, './testing'));
    });

    test('Request', async () => {
      const result = await buildEmailComponent(emailSlug);

      expect(isOk(result), 'There should be no errors building').toBe(true);
    });
  });

  test('with a demo email template', async () => {
    mockEnv(path.resolve(__dirname, '../../../../apps/demo/emails'));

    const emailSlug = 'notifications/vercel-invite-user';
    const result = await buildEmailComponent(emailSlug);

    if (isErr(result)) {
      console.log(result.error);
      expect('error' in result).toBe(false);
    } else {
      const emailComponent = await getEmailComponent(emailSlug);
      expect(emailComponent).toBeTruthy();
      expect(emailComponent!.sourceMap).toBeTruthy();

      const emailHtml = await emailComponent!.render(
        emailComponent!.createElement(
          emailComponent!.emailComponent,
          emailComponent!.emailComponent.PreviewProps,
        ),
      );
      expect(emailHtml).toMatchSnapshot();
    }
  });
});
