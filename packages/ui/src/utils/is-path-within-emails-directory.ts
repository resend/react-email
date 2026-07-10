import fs from 'node:fs';
import path from 'node:path';

const safeRealpath = (target: string): string => {
  try {
    return fs.realpathSync(target);
  } catch {
    return path.resolve(target);
  }
};

/**
 * Returns true when `emailPath` resolves to a location inside the emails
 * directory configured via REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH.
 *
 * Server actions accept arbitrary strings from the client, so any path that
 * eventually reaches the filesystem must be checked against this boundary to
 * prevent traversal (`../../etc/passwd`) and absolute-path escapes.
 */
export const isPathWithinEmailsDirectory = (emailPath: string): boolean => {
  const root = process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH;
  if (!root) return false;

  const resolvedRoot = safeRealpath(path.resolve(root));
  const resolvedTarget = safeRealpath(path.resolve(resolvedRoot, emailPath));

  return (
    resolvedTarget === resolvedRoot ||
    resolvedTarget.startsWith(resolvedRoot + path.sep)
  );
};
