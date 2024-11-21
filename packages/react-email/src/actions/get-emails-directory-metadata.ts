'use server';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from 'node:fs';
import path from 'node:path';

const isFileAnEmail = async (fullPath: string): Promise<boolean> => {
  const fd = await fs.promises.open(fullPath, 'r');
  const stat = await fd.stat();

  if (stat.isDirectory()) {
    await fd.close();
    return false;
  }

  const { ext } = path.parse(fullPath);

  if (!['.js', '.tsx', '.jsx'].includes(ext)) {
    await fd.close();
    return false;
  }

  const fileContents = await fd.readFile('utf8');

  await fd.close();
  return /\bexport\s+default\b|\bmodule\s*\.\s*exports\b/gm.test(fileContents);
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

const asyncFilter = async <T>(
  array: T[],
  predicate: (item: T) => Promise<boolean>,
): Promise<T[]> => {
  const filteringResults = await Promise.all(
    array.map((item) => predicate(item)),
  );
  return array.filter((_, i) => filteringResults[i]);
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

  const emailFilenames = (
    await asyncFilter(dirents, (dirent) =>
      isFileAnEmail(path.join(absolutePathToEmailsDirectory, dirent.name)),
    )
  ).map((dirent) =>
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
