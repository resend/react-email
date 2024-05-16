import path from 'node:path';
import fs from 'node:fs';
import { exportTemplates } from '../export';

test('email export', async () => {
  const pathToEmailsDirectory = path.resolve(__dirname, './emails');
  const pathToDumpMarkup = path.resolve(__dirname, './out');
  await exportTemplates(pathToDumpMarkup, pathToEmailsDirectory, {
    pretty: true,
    silent: true,
  });

  expect(fs.existsSync(pathToDumpMarkup)).toBe(true);
  expect(
    await fs.promises.readFile(
      path.resolve(pathToDumpMarkup, './vercel-invite-user.html'),
      'utf8',
    ),
  ).toMatchSnapshot();
});
