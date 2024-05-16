import path from 'node:path';
import fs from 'node:fs';
import { exportTemplates } from '../export';

test('email export', async () => {
  const pathToEmailsDirectory = path.resolve(__dirname, './emails');
  const pathToDumpMarkup = path.resolve(__dirname, './out');
  await exportTemplates(pathToEmailsDirectory, pathToDumpMarkup, {
    pretty: true,
  });

  expect(fs.existsSync(pathToDumpMarkup)).toBe(true);
  expect(
    fs.existsSync(path.resolve(pathToDumpMarkup, './vercel-invite-user')),
  ).toBe(true);
});
