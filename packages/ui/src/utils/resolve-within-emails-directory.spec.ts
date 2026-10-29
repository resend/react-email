import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { resolveWithinEmailsDirectory } from './resolve-within-emails-directory';

describe('resolveWithinEmailsDirectory()', () => {
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

  const realWelcomePath = () =>
    fs.realpathSync(path.join(emailsRoot, 'welcome.tsx'));

  it('resolves a file directly inside the emails directory', () => {
    expect(
      resolveWithinEmailsDirectory(path.join(emailsRoot, 'welcome.tsx')),
    ).toBe(realWelcomePath());
  });

  it('resolves the emails directory itself', () => {
    expect(resolveWithinEmailsDirectory(emailsRoot)).toBe(
      fs.realpathSync(emailsRoot),
    );
  });

  it('resolves a relative path against the emails directory', () => {
    expect(resolveWithinEmailsDirectory('welcome.tsx')).toBe(realWelcomePath());
    expect(resolveWithinEmailsDirectory('./welcome.tsx')).toBe(
      realWelcomePath(),
    );
  });

  it('rejects absolute paths outside the emails directory', () => {
    expect(resolveWithinEmailsDirectory(outsideFile)).toBeUndefined();
    expect(resolveWithinEmailsDirectory('/etc/passwd')).toBeUndefined();
  });

  it('rejects traversal attempts via ../', () => {
    expect(resolveWithinEmailsDirectory('../secret.txt')).toBeUndefined();
    expect(resolveWithinEmailsDirectory('../../etc/passwd')).toBeUndefined();
    expect(
      resolveWithinEmailsDirectory(path.join(emailsRoot, '..', 'secret.txt')),
    ).toBeUndefined();
  });

  it('rejects sibling directories with a shared prefix', () => {
    const sibling = `${emailsRoot}-other`;
    fs.mkdirSync(sibling, { recursive: true });
    try {
      expect(resolveWithinEmailsDirectory(path.join(sibling, 'evil.tsx'))).toBeUndefined();
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
      expect(resolveWithinEmailsDirectory(symlinkPath)).toBeUndefined();
    } finally {
      fs.rmSync(symlinkPath, { force: true });
    }
  });

  it('rejects everything when the env var is unset (fail closed)', () => {
    const saved = process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH;
    delete process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH;
    try {
      expect(
        resolveWithinEmailsDirectory(path.join(emailsRoot, 'welcome.tsx')),
      ).toBeUndefined();
    } finally {
      process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH = saved;
    }
  });
});
