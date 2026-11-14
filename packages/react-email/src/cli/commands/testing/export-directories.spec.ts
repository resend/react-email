import fs from 'node:fs';
import path from 'node:path';
import { exportTemplates } from '../export.js';

test.each([
  false,
  true,
])('email export preserves directories across batches, root %s', async (includeRootTemplate) => {
  const projectDirectory = fs.mkdtempSync(
    path.join(__dirname, 'export-directories-'),
  );
  const emailsDirectory = path.join(projectDirectory, 'emails');
  const outputDirectory = path.join(projectDirectory, 'out');
  const templates = new Map<string, string>();

  for (const folder of ['a', 'b']) {
    for (let index = 0; index < 10; index++) {
      templates.set(
        path.join(folder, `email-${index}`),
        `${folder} email ${index}`,
      );
    }
  }
  if (includeRootTemplate) {
    templates.set('welcome', 'Root welcome');
  }

  try {
    for (const [name, text] of templates) {
      const filename = path.join(emailsDirectory, `${name}.tsx`);
      fs.mkdirSync(path.dirname(filename), { recursive: true });
      fs.writeFileSync(
        filename,
        `export default function Email() { return ${JSON.stringify(text)}; }`,
      );
    }

    await exportTemplates(outputDirectory, emailsDirectory, {
      silent: true,
    });

    for (const [name, text] of templates) {
      const html = fs.readFileSync(
        path.join(outputDirectory, `${name}.html`),
        'utf8',
      );
      expect(html).toContain(text);
    }
    expect(
      fs
        .readdirSync(outputDirectory, { recursive: true })
        .filter((name) => String(name).endsWith('.html')),
    ).toHaveLength(templates.size);
  } finally {
    fs.rmSync(projectDirectory, { recursive: true, force: true });
  }
});

test.each([
  'nested',
  'marketing.cjs',
])('email export preserves a single nested source directory %s', async (directory) => {
  const projectDirectory = fs.mkdtempSync(
    path.join(__dirname, 'export-directories-'),
  );
  const emailsDirectory = path.join(projectDirectory, 'emails');
  const outputDirectory = path.join(projectDirectory, 'out');
  const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`process.exit(${code})`);
  });

  try {
    fs.mkdirSync(path.join(emailsDirectory, directory), { recursive: true });
    fs.writeFileSync(
      path.join(emailsDirectory, directory, 'welcome.tsx'),
      "export default function Email() { return 'Nested welcome'; }",
    );

    await exportTemplates(outputDirectory, emailsDirectory, { silent: true });

    expect(
      fs.readFileSync(
        path.join(outputDirectory, directory, 'welcome.html'),
        'utf8',
      ),
    ).toContain('Nested welcome');
  } finally {
    exitSpy.mockRestore();
    fs.rmSync(projectDirectory, { recursive: true, force: true });
  }
});
