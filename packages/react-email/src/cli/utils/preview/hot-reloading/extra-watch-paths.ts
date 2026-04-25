import path from 'node:path';
import type { EmailsDirectory } from '../../get-emails-directory-metadata.js';

export const isUnderAnyPath = (absolutePath: string, roots: string[]) =>
  roots.some(
    (root) => absolutePath === root || absolutePath.startsWith(root + path.sep),
  );

export const collectEmailTemplatePaths = (
  directory: EmailsDirectory,
): string[] => {
  const paths = directory.emailFilenames.map((filename) =>
    path.join(directory.absolutePath, filename),
  );
  for (const subDirectory of directory.subDirectories) {
    paths.push(...collectEmailTemplatePaths(subDirectory));
  }
  return paths;
};
