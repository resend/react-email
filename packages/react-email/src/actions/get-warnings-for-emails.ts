'use server';

import { sep } from 'node:path';
import { promises as fs } from 'node:fs';
import { getValiationWarningsFor } from '../utils/email-validation';
import type { EmailsDirectory } from './get-emails-directory-metadata';
import { getEmailPathFromSlug } from './get-email-path-from-slug';

export interface EmailValidationWarning {
  emailPath: string;
  message: string;
  line: number;
  column: number;
}

export const getWarningsForEmails = async (
  emailsDirectory: EmailsDirectory,
) => {
  const warnings: EmailValidationWarning[] = [];

  for await (const subDirectory of emailsDirectory.subDirectories) {
    warnings.push(...(await getWarningsForEmails(subDirectory)));
  }

  for await (const filename of emailsDirectory.emailFilenames) {
    const slug = `${emailsDirectory.relativePath.replaceAll(sep, '/')}/${filename}`;
    const path = await getEmailPathFromSlug(slug);
    const code = await fs.readFile(path, 'utf8');
    const emailWarnings = await getValiationWarningsFor(code, filename);
    warnings.push(...emailWarnings);
  }

  return warnings;
};
