'use server';

import path from 'node:path';
import { resend } from '../lib/resend';
import type { EmailsDirectory } from '../utils/get-emails-directory-metadata';
import { getEmailsDirectoryMetadataAction } from './get-emails-directory-metadata-action';
import { renderEmailByPath } from './render-email-by-path';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const bulkImportTemplates = async (emailPath: string) => {
  try {
    const emailsDirectory = await getEmailsDirectoryMetadataAction(
      path.dirname(emailPath),
      true,
    );
    if (!emailsDirectory) {
      throw new Error('No emails directory found');
    }

    const results = {
      success: [] as string[],
      failed: [] as { name: string; error: string }[],
    };

    const processDirectoryMetadata = async (directory: EmailsDirectory) => {
      for (const filename of directory.emailFilenames) {
        try {
          const templateName = path.parse(filename).name;
          const result = await renderEmailByPath(
            path.join(directory.absolutePath, filename),
          );

          if ('error' in result) {
            throw new Error(result.error.message);
          }

          await resend.templates.create({
            name: templateName,
            html: result.markup,
          });

          results.success.push(templateName);

          await sleep(500);
        } catch (error) {
          results.failed.push({
            name: filename,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      for (const subDir of directory.subDirectories) {
        await processDirectoryMetadata(subDir);
      }
    };

    await processDirectoryMetadata(emailsDirectory);

    return results;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Failed to bulk import templates');
  }
};
