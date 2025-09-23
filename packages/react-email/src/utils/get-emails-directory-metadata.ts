import fs from 'node:fs';
import path from 'node:path';

const isFileAnEmail = async (fullPath: string): Promise<boolean> => {
  let fileHandle: fs.promises.FileHandle;
  try {
    fileHandle = await fs.promises.open(fullPath, 'r');
  } catch (exception) {
    console.warn(exception);
    return false;
  }
  const stat = await fileHandle.stat();

  if (stat.isDirectory()) {
    await fileHandle.close();
    return false;
  }

  const { ext } = path.parse(fullPath);

  if (!['.js', '.tsx', '.jsx'].includes(ext)) {
    await fileHandle.close();
    return false;
  }

  // check with a heuristic to see if the file has at least
  // a default export (ES6) or module.exports (CommonJS) or named exports (MDX)
  const fileContents = await fileHandle.readFile('utf8');

  await fileHandle.close();

  // Check for ES6 export default syntax
  const hasES6DefaultExport = /\bexport\s+default\b/gm.test(fileContents);

  // Check for CommonJS module.exports syntax
  const hasCommonJSExport = /\bmodule\.exports\s*=/gm.test(fileContents);

  // Check for named exports (used in MDX files) and ensure at least one is marked as default
  const hasNamedExport = /\bexport\s+\{[^}]*\bdefault\b[^}]*\}/gm.test(
    fileContents,
  );

  return hasES6DefaultExport || hasCommonJSExport || hasNamedExport;
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

  const isEmailPredicates = await Promise.all(
    dirents.map((dirent) =>
      isFileAnEmail(path.join(absolutePathToEmailsDirectory, dirent.name)),
    ),
  );
  const emailFilenames = dirents
    .filter((_, i) => isEmailPredicates[i])
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
