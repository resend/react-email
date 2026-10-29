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
 * Resolves `emailPath` against the emails directory configured via
 * REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH and returns its real path, or
 * `undefined` when it lands outside of it.
 *
 * Server actions accept arbitrary strings from the client, so any path that
 * eventually reaches the filesystem must go through this boundary to prevent
 * traversal (`../../etc/passwd`) and absolute-path escapes. Callers must use the
 * returned path: resolving the original one again (e.g. against the working
 * directory) would read a different file than the one that was checked.
 */
export const resolveWithinEmailsDirectory = (
  emailPath: string,
): string | undefined => {
  const root = process.env.REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH;
  if (!root) return undefined;

  const resolvedRoot = safeRealpath(path.resolve(root));
  const resolvedTarget = safeRealpath(path.resolve(resolvedRoot, emailPath));

  if (
    resolvedTarget !== resolvedRoot &&
    !resolvedTarget.startsWith(resolvedRoot + path.sep)
  ) {
    return undefined;
  }

  return resolvedTarget;
};
