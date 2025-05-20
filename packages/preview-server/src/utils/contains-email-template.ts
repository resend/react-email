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
  const remainingSegments = relativeEmailPath
    .replace(directory.relativePath, '')
    .split('/')
    .filter(Boolean);
  if (remainingSegments.length === 1) {
    const emailFilename = removeFilenameExtension(remainingSegments[0]!);
    return directory.emailFilenames.includes(emailFilename);
  }
  const subDirectory = directory.subDirectories.find(
    (sub) => sub.directoryName === remainingSegments[0],
  );
  if (subDirectory === undefined) {
    return false;
  }

  return containsEmailTemplate(relativeEmailPath, subDirectory);
};
