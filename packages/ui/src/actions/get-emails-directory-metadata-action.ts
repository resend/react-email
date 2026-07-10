'use server';

import { emailsDirectoryAbsolutePath } from '../app/env';
import type { EmailsDirectory } from '../utils/get-emails-directory-metadata';
import { getEmailsDirectoryMetadata } from '../utils/get-emails-directory-metadata';

export const getEmailsDirectoryMetadataAction = async (): Promise<
  EmailsDirectory | undefined
> => {
  return getEmailsDirectoryMetadata(emailsDirectoryAbsolutePath);
};
