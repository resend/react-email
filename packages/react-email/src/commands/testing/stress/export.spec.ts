import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';
import { exportTemplates } from '../../export.js';

test('email export', async () => {
  const emailsQuantity = 100;
  const emailsDir = path.join(__dirname, 'emails');
  const srcDir = path.join(__dirname, 'src');
  const outDir = path.join(__dirname, 'out');

  fs.rmSync(emailsDir, { force: true });

  const templates = fs.readdirSync(srcDir).filter((file) =>
    file.endsWith('.tsx'),
  );

  for (let i = 0; i < emailsQuantity; i++) {
    const template = String(templates[i % templates.length]);
    const { name } = path.parse(template);
    const source = path.join(srcDir, template);
    const destination = path.join(emailsDir, `${i}_${name}.tsx`);
    fs.cpSync(source, destination);
  }

  await exportTemplates(outDir, emailsDir, { silent: true, pretty: true });

  expect(fs.existsSync(outDir)).toBe(true);
});
