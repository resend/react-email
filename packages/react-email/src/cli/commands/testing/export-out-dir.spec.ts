import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { exportTemplates, getUnsafeOutDirMessage } from '../export.js';

const homeDirectory = path.resolve('/home/user');
const cwd = path.join(homeDirectory, 'project');
const emailsDirectoryPath = './emails';

const getMessage = (outDir: string, emailsDirectory = emailsDirectoryPath) =>
  getUnsafeOutDirMessage(outDir, emailsDirectory, { cwd, homeDirectory });

test('blocks the filesystem root', () => {
  expect(getMessage(path.parse(cwd).root)).toBe(
    "--outDir can't be the filesystem root.",
  );
});

test('blocks the home directory', () => {
  expect(getMessage(homeDirectory)).toBe(
    "--outDir can't be your home directory.",
  );
  expect(getMessage('..')).toBe("--outDir can't be your home directory.");
});

test('blocks a parent of the home directory', () => {
  expect(getMessage(path.dirname(homeDirectory))).toBe(
    "--outDir can't contain your home directory.",
  );
});

test('blocks the project directory', () => {
  expect(getMessage('.')).toBe("--outDir can't be the project directory.");
  expect(getMessage(cwd)).toBe("--outDir can't be the project directory.");
});

test('blocks a parent of the project directory', () => {
  const nestedCwd = path.join(cwd, 'apps', 'emails');
  expect(
    getUnsafeOutDirMessage('..', emailsDirectoryPath, {
      cwd: nestedCwd,
      homeDirectory,
    }),
  ).toBe("--outDir can't contain the project directory.");
});

test('blocks the email templates directory and its parents', () => {
  const message = "--outDir can't contain your email templates.";
  expect(getMessage('emails')).toBe(message);
  expect(getMessage('./emails/')).toBe(message);
  expect(getMessage(path.join(cwd, 'emails'))).toBe(message);
  expect(getMessage('src', './src/emails')).toBe(message);
});

test('blocks the static assets directory', () => {
  const message = "--outDir can't be your static assets directory.";
  expect(getMessage('emails/static')).toBe(message);
  expect(getMessage('emails/static/images')).toBe(message);
});

test('allows other directories', () => {
  expect(getMessage('out')).toBeUndefined();
  expect(getMessage('out/nested')).toBeUndefined();
  expect(getMessage('emails/out')).toBeUndefined();
  expect(getMessage('../sibling')).toBeUndefined();
  expect(getMessage('/tmp/react-email-out')).toBeUndefined();
});

test('refuses to remove the project directory and keeps files intact', async () => {
  const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'export-guard-'));
  const emailsDir = path.join(projectDir, 'emails');
  fs.mkdirSync(emailsDir, { recursive: true });
  fs.writeFileSync(
    path.join(emailsDir, 'welcome.tsx'),
    'export default () => null;',
  );
  fs.writeFileSync(path.join(projectDir, 'package.json'), '{}');

  const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue(projectDir);
  const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((
    code?: number,
  ) => {
    throw new Error(`process.exit(${code})`);
  }) as never);
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  try {
    await expect(
      exportTemplates('.', 'emails', { silent: true }),
    ).rejects.toThrow('process.exit(1)');

    expect(errorSpy).toHaveBeenCalledWith(
      `--outDir can't be the project directory. Choose a different --outDir, such as "out".`,
    );
    expect(fs.existsSync(path.join(projectDir, 'package.json'))).toBe(true);
    expect(fs.existsSync(path.join(emailsDir, 'welcome.tsx'))).toBe(true);
  } finally {
    cwdSpy.mockRestore();
    exitSpy.mockRestore();
    errorSpy.mockRestore();
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
});
