import path from 'node:path';
import fs from 'node:fs';
import { exportTemplates } from '../export';

// This test is failing while we are using React 18 in the preview server because
// the components will use React 19, while the email template will use React 18
// so the different structures of elements will be used interchangeably which will fail
// when rendering.
test.fails('email export', async () => {
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
