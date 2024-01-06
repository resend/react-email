'use server';
import fs from 'node:fs';
import path from 'node:path';
import { emailsDirPath } from '../emails-dir-path';

const isFileAnEmail = (fullPath: string): boolean => {
  const unixFullPath = fullPath.replaceAll(path.sep, '/');

  // eslint-disable-next-line prefer-named-capture-group
  if (/(\/|^)_[^/]*/.test(unixFullPath)) return false;

  const stat = fs.statSync(fullPath);

  if (stat.isDirectory()) return false;

  const { ext } = path.parse(fullPath);

  if (!['.js', '.tsx', '.jsx'].includes(ext)) return false;

  // check with a heuristic to see if the file has at least
  // a default export
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  return /\bexport\s+default\b/gm.test(fileContents);
};

export interface EmailsDirectory {
  absolutePath: string;
  unixAbsolutePath: string;
  emailFilenames: string[];
  subDirectories: EmailsDirectory[];
}

export const getEmailsDirectoryMetadata = async (
  absolutePathToEmailsDirectory: string = emailsDirPath,
): Promise<EmailsDirectory | undefined> => {
  if (!fs.existsSync(absolutePathToEmailsDirectory)) return;

  const dirents = await fs.promises.readdir(absolutePathToEmailsDirectory, {
    withFileTypes: true,
  });

  const emailFilenames = dirents
    .filter((dirent) => isFileAnEmail(path.join(dirent.path, dirent.name)))
    .map((dirent) => dirent.name);

  const subDirectories = await Promise.all(
    dirents
      .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('_'))
      .map(
        (dirent) =>
          getEmailsDirectoryMetadata(path.join(dirent.path, dirent.name)) as Promise<EmailsDirectory>,
      ),
  );

  return {
    absolutePath: absolutePathToEmailsDirectory,
    unixAbsolutePath: absolutePathToEmailsDirectory.replaceAll(path.sep, '/'),
    emailFilenames,
    subDirectories,
  };
};
