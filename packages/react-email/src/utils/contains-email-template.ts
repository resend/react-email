import type { EmailsDirectory } from "./get-emails-directory-metadata";

export const containsEmailTemplate = (
  relativeEmailPath: string,
  directory: EmailsDirectory,
) => {
  const remainingSegments = relativeEmailPath
    .replace(directory.relativePath, '')
    .split('/')
    .filter(Boolean);
  if (remainingSegments.length === 1) {
    const emailFilename = remainingSegments[0]!;
    return directory.emailFilenames.includes(emailFilename);
  }
  const subDirectory = directory.subDirectories.find(
    (sub) => sub.relativePath === remainingSegments[0],
  );
  if (subDirectory === undefined) {
    return false;
  }

  return containsEmailTemplate(relativeEmailPath, subDirectory);
};
