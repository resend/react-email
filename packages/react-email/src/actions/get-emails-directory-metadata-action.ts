'use server';

import type { EmailsDirectory } from '../utils/get-emails-directory-metadata';
import { getEmailsDirectoryMetadata } from '../utils/get-emails-directory-metadata';

export const getEmailsDirectoryMetadataAction = async (
  absolutePathToEmailsDirectory: string,
  keepFileExtensions = false,
  isSubDirectory = false,

  baseDirectoryPath = absolutePathToEmailsDirectory,
): Promise<EmailsDirectory | undefined> => {
  return getEmailsDirectoryMetadata(
    absolutePathToEmailsDirectory,
    keepFileExtensions,
    isSubDirectory,
    baseDirectoryPath,
  );
};
