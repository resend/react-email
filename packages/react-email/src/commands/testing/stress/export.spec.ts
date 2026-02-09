import fsPromises from 'node:fs/promises';
import fs from 'node:fs';
import path from 'node:path';
import { exportTemplates } from '../../export.js';

test('email export', async () => {
  const emailsQuantity = 660;
  const emailsDir = path.join(__dirname, 'emails');
  const srcDir = path.join(__dirname, 'src');
  await fsPromises.rm(emailsDir);
  const templates = (await fsPromises.readdir(srcDir))
    .filter(file => file.endsWith('.tsx'));
  for (let i = 0; i < emailsQuantity; i++) {
    const template = String(templates[i % templates.length]);
    const { name } = path.parse(template);
    const source = path.join(srcDir, template);
    const destination = path.join(
      emailsDir,
      `${i}_${name}.tsx`
    );

    await fsPromises.cp(source, destination);
  }
  const pathToEmailsDirectory = path.resolve(__dirname, './emails');
  const pathToDumpMarkup = path.resolve(__dirname, './out');
  await exportTemplates(pathToDumpMarkup, pathToEmailsDirectory, {
    silent: true,
    pretty: true,
  });

  expect(fs.existsSync(pathToDumpMarkup)).toBe(true);
});
