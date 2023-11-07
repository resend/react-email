'use server';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from 'node:fs';
import path from 'node:path';

const isFileAnEmail = (fullPath: string): boolean => {
  const stat = fs.statSync(fullPath);

  if (stat.isDirectory()) return false;

  const { ext } = path.parse(fullPath);

  if (!['.js', '.tsx', '.jsx'].includes(ext)) return false;

  // This is to avoid a possible race condition where the file doesn't exist anymore
  // once we are checking if it is an actual email, this couuld cause issues that
  // would be very hard to debug and find out the why of it happening.
  if (!fs.existsSync(fullPath)) {
    return false;
  }

  // check with a heuristic to see if the file has at least
  // a default export
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  return /\bexport\s+default\b/gm.test(fileContents);
};

export interface EmailsDirectory {
  absolutePath: string;
  relativePath: string;
  directoryName: string;
  emailFilenames: string[];
  subDirectories: EmailsDirectory[];
}

const mergeDirectoriesWithSubDirectories = (
  emailsDirectoryMetadata: EmailsDirectory,
): EmailsDirectory => {
  let currentResultingMergedDirectory: EmailsDirectory =
    emailsDirectoryMetadata;

  while (
    currentResultingMergedDirectory.emailFilenames.length === 0 &&
    currentResultingMergedDirectory.subDirectories.length === 1
  ) {
    const onlySubDirectory = currentResultingMergedDirectory.subDirectories[0]!;
    currentResultingMergedDirectory = {
      ...onlySubDirectory,
      directoryName: path.join(
        currentResultingMergedDirectory.directoryName,
        onlySubDirectory.directoryName,
      ),
    };
  }

  return currentResultingMergedDirectory;
};

export const getEmailsDirectoryMetadata = async (
  absolutePathToEmailsDirectory: string,
  keepFileExtensions = false,
  isSubDirectory = false,

  baseDirectoryPath = absolutePathToEmailsDirectory,
): Promise<EmailsDirectory | undefined> => {
  if (!fs.existsSync(absolutePathToEmailsDirectory)) return;

  const dirents = await fs.promises.readdir(absolutePathToEmailsDirectory, {
    withFileTypes: true,
  });

  const emailFilenames = dirents
    .filter((dirent) =>
      isFileAnEmail(path.join(absolutePathToEmailsDirectory, dirent.name)),
    )
    .map((dirent) =>
      keepFileExtensions
        ? dirent.name
        : dirent.name.replace(path.extname(dirent.name), ''),
    );

  const subDirectories = await Promise.all(
    dirents
      .filter(
        (dirent) =>
          dirent.isDirectory() &&
          !dirent.name.startsWith('_') &&
          dirent.name !== 'static',
      )
      .map((dirent) => {
        const direntAbsolutePath = path.join(
          absolutePathToEmailsDirectory,
          dirent.name,
        );

        return getEmailsDirectoryMetadata(
          direntAbsolutePath,
          keepFileExtensions,
          true,
          baseDirectoryPath,
        ) as Promise<EmailsDirectory>;
      }),
  );

  const emailsMetadata = {
    absolutePath: absolutePathToEmailsDirectory,
    relativePath: path.relative(
      baseDirectoryPath,
      absolutePathToEmailsDirectory,
    ),
    directoryName: absolutePathToEmailsDirectory.split(path.sep).pop()!,
    emailFilenames,
    subDirectories,
  } satisfies EmailsDirectory;

  return isSubDirectory
    ? mergeDirectoriesWithSubDirectories(emailsMetadata)
    : emailsMetadata;
};
