import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { exportTemplates, isUnsafeDirectoryToRemove } from './export.js';

const cwd = path.resolve('/project');
const emailsDirectoryPath = './emails';

test('blocks the filesystem root', () => {
  expect(isUnsafeDirectoryToRemove('/', emailsDirectoryPath, cwd)).toBe(true);
});

test('blocks the project directory itself', () => {
  expect(isUnsafeDirectoryToRemove('.', emailsDirectoryPath, cwd)).toBe(true);
  expect(isUnsafeDirectoryToRemove(cwd, emailsDirectoryPath, cwd)).toBe(true);
});

test('blocks a parent of the project directory', () => {
  expect(isUnsafeDirectoryToRemove('..', emailsDirectoryPath, cwd)).toBe(true);
});

test('blocks the email templates directory', () => {
  expect(isUnsafeDirectoryToRemove('./emails', emailsDirectoryPath, cwd)).toBe(
    true,
  );
});

test('allows a sibling or nested output directory', () => {
  expect(isUnsafeDirectoryToRemove('./out', emailsDirectoryPath, cwd)).toBe(
    false,
  );
  expect(
    isUnsafeDirectoryToRemove('./out/nested', emailsDirectoryPath, cwd),
  ).toBe(false);
  expect(
    isUnsafeDirectoryToRemove('/tmp/react-email-out', emailsDirectoryPath, cwd),
  ).toBe(false);
});

test('blocks an absolute email templates directory', () => {
  const absoluteEmailsDirectory = path.resolve('/project/emails');
  expect(
    isUnsafeDirectoryToRemove(
      absoluteEmailsDirectory,
      absoluteEmailsDirectory,
      cwd,
    ),
  ).toBe(true);
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

  await expect(
    exportTemplates('.', 'emails', { silent: true }),
  ).rejects.toThrow('process.exit(1)');

  expect(errorSpy).toHaveBeenCalledWith(
    expect.stringContaining('Refusing to remove'),
  );
  expect(exitSpy).toHaveBeenCalledWith(1);
  expect(fs.existsSync(path.join(projectDir, 'package.json'))).toBe(true);
  expect(fs.existsSync(path.join(emailsDir, 'welcome.tsx'))).toBe(true);

  cwdSpy.mockRestore();
  exitSpy.mockRestore();
  errorSpy.mockRestore();
  fs.rmSync(projectDir, { recursive: true, force: true });
});
