import type { EmailsDirectory } from './get-emails-directory-metadata';

export const removeFilenameExtension = (filename: string): string => {
  const parts = filename.split('.');

  if (parts.length > 1) {
    return parts.slice(0, -1).join('.');
  }

  return filename;
};

export const containsEmailTemplate = (
  relativeEmailPath: string,
  directory: EmailsDirectory,
) => {
  const pathSeparator = relativeEmailPath.includes('\\') ? '\\' : '/';
  const emailPathSegments = relativeEmailPath
    .replace(directory.relativePath, '')
    .split(pathSeparator)
    .filter(Boolean);

  return containsEmailPathSegments(emailPathSegments, directory, pathSeparator);
};

const containsEmailPathSegments = (
  relativeEmailSegments: string[],
  directory: EmailsDirectory,
  pathSeparator: string,
) => {
  if (relativeEmailSegments.length === 1) {
    const emailFilename = removeFilenameExtension(relativeEmailSegments[0]!);
    return directory.emailFilenames.includes(emailFilename);
  }

  const remainingPath = relativeEmailSegments.join(pathSeparator);

  for (const subDirectory of directory.subDirectories) {
    if (remainingPath.startsWith(subDirectory.directoryName)) {
      const matchedSegments = subDirectory.directoryName
        .split(pathSeparator)
        .filter(Boolean).length;

      return containsEmailPathSegments(
        relativeEmailSegments.slice(matchedSegments),
        subDirectory,
        pathSeparator,
      );
    }
  }

  return false;
};
