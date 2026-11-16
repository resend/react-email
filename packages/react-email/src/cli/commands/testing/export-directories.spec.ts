import fs from 'node:fs';
import path from 'node:path';
import { exportTemplates } from '../export.js';

function templatesIn(folder: string, count: number) {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => [
      `${folder}/email-${index}`,
      `${folder} email ${index}`,
    ]),
  );
}

function stripFolder(templates: Record<string, string>, folder: string) {
  return Object.fromEntries(
    Object.entries(templates).map(([name, text]) => [
      name.replace(`${folder}/`, ''),
      text,
    ]),
  );
}

const siblingFolders = { ...templatesIn('a', 10), ...templatesIn('b', 10) };
const nestedSiblingFolders = {
  ...templatesIn('brand/a', 6),
  ...templatesIn('brand/b', 6),
};

test.each([
  ['sibling folders with the same filenames', siblingFolders, siblingFolders],
  [
    'sibling folders and a root template',
    { welcome: 'Root welcome', ...siblingFolders },
    { welcome: 'Root welcome', ...siblingFolders },
  ],
  [
    'sibling folders inside one shared folder',
    nestedSiblingFolders,
    stripFolder(nestedSiblingFolders, 'brand'),
  ],
  [
    'a single nested folder',
    { 'nested/welcome': 'Nested welcome' },
    { welcome: 'Nested welcome' },
  ],
  [
    'a folder named like a bundle',
    { welcome: 'Root welcome', 'marketing.cjs/welcome': 'Marketing welcome' },
    { welcome: 'Root welcome', 'marketing.cjs/welcome': 'Marketing welcome' },
  ],
])('email export keeps every template with %s, relative to the folder they all share', async (_, templates, expectedOutput) => {
  const projectDirectory = fs.mkdtempSync(
    path.join(__dirname, 'export-directories-'),
  );
  const emailsDirectory = path.join(projectDirectory, 'emails');
  const outputDirectory = path.join(projectDirectory, 'out');
  const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`process.exit(${code})`);
  });

  try {
    for (const [name, text] of Object.entries(templates)) {
      const filename = path.join(emailsDirectory, `${name}.tsx`);
      fs.mkdirSync(path.dirname(filename), { recursive: true });
      fs.writeFileSync(
        filename,
        `export default function Email() { return ${JSON.stringify(text)}; }`,
      );
    }

    await exportTemplates(outputDirectory, emailsDirectory, { silent: true });

    const outputFiles = fs
      .readdirSync(outputDirectory, { recursive: true })
      .map(String)
      .filter((name) => name.endsWith('.html'))
      .map((name) => name.split(path.sep).join('/'))
      .sort();
    expect(outputFiles).toEqual(
      Object.keys(expectedOutput)
        .map((name) => `${name}.html`)
        .sort(),
    );
    for (const [name, text] of Object.entries(expectedOutput)) {
      expect(
        fs.readFileSync(path.join(outputDirectory, `${name}.html`), 'utf8'),
      ).toContain(text);
    }
  } finally {
    exitSpy.mockRestore();
    fs.rmSync(projectDirectory, { recursive: true, force: true });
  }
});
