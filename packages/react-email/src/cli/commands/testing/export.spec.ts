import fs from 'node:fs';
import path from 'node:path';
import { exportTemplates } from '../export';

test('email export', async () => {
  const pathToEmailsDirectory = path.resolve(
    __dirname,
    '../../../../../../apps/demo/emails',
  );
  const pathToDumpMarkup = path.resolve(__dirname, './out');
  await exportTemplates(pathToDumpMarkup, pathToEmailsDirectory, {
    pretty: true,
    silent: true,
  });

  expect(fs.existsSync(pathToDumpMarkup)).toBe(true);
  expect(
    await fs.promises.readFile(
      path.resolve(pathToDumpMarkup, './notifications/vercel-invite-user.html'),
      'utf8',
    ),
  ).toMatchSnapshot();
});
