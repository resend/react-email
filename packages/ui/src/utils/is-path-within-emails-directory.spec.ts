import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { isPathWithinEmailsDirectory } from './is-path-within-emails-directory';

describe('isPathWithinEmailsDirectory()', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rxe-path-guard-'));
  const emailsRoot = path.join(tmpRoot, 'emails');
  const outsideFile = path.join(tmpRoot, 'secret.txt');

  let previousEnvValue: string | undefined;

  beforeAll(() => {
    fs.mkdirSync(emailsRoot, { recursive: true });
    fs.writeFileSync(path.join(emailsRoot, 'welcome.tsx'), '// fixture');
    fs.writeFileSync(outsideFile, 'top secret');

    previousEnvValue =
      process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH;
    process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH = emailsRoot;
  });

  afterAll(() => {
    if (previousEnvValue === undefined) {
      delete process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH;
    } else {
      process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH =
        previousEnvValue;
    }
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('accepts a file directly inside the emails directory', () => {
    expect(
      isPathWithinEmailsDirectory(path.join(emailsRoot, 'welcome.tsx')),
    ).toBe(true);
  });

  it('accepts the emails directory itself', () => {
    expect(isPathWithinEmailsDirectory(emailsRoot)).toBe(true);
  });

  it('accepts a relative path that resolves inside the emails directory', () => {
    expect(isPathWithinEmailsDirectory('welcome.tsx')).toBe(true);
    expect(isPathWithinEmailsDirectory('./welcome.tsx')).toBe(true);
  });

  it('rejects absolute paths outside the emails directory', () => {
    expect(isPathWithinEmailsDirectory(outsideFile)).toBe(false);
    expect(isPathWithinEmailsDirectory('/etc/passwd')).toBe(false);
  });

  it('rejects traversal attempts via ../', () => {
    expect(isPathWithinEmailsDirectory('../secret.txt')).toBe(false);
    expect(isPathWithinEmailsDirectory('../../etc/passwd')).toBe(false);
    expect(
      isPathWithinEmailsDirectory(
        path.join(emailsRoot, '..', 'secret.txt'),
      ),
    ).toBe(false);
  });

  it('rejects sibling directories with a shared prefix', () => {
    const sibling = `${emailsRoot}-other`;
    fs.mkdirSync(sibling, { recursive: true });
    try {
      expect(isPathWithinEmailsDirectory(path.join(sibling, 'evil.tsx'))).toBe(
        false,
      );
    } finally {
      fs.rmSync(sibling, { recursive: true, force: true });
    }
  });

  it('rejects symlinks that escape the emails directory', () => {
    const symlinkPath = path.join(emailsRoot, 'escape.txt');
    try {
      fs.symlinkSync(outsideFile, symlinkPath);
    } catch {
      // Some CI environments may forbid symlink creation; skip in that case.
      return;
    }
    try {
      expect(isPathWithinEmailsDirectory(symlinkPath)).toBe(false);
    } finally {
      fs.rmSync(symlinkPath, { force: true });
    }
  });

  it('rejects everything when the env var is unset (fail closed)', () => {
    const saved = process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH;
    delete process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH;
    try {
      expect(
        isPathWithinEmailsDirectory(path.join(emailsRoot, 'welcome.tsx')),
      ).toBe(false);
    } finally {
      process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH = saved;
    }
  });
});
