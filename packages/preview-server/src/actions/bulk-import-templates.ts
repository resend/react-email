'use server';

import path from 'node:path';
import { z } from 'zod';
import { emailsDirectoryAbsolutePath } from '../app/env';
import { resend } from '../lib/resend';
import { sleep } from '../utils/sleep';
import { getEmailsDirectoryMetadataAction } from './get-emails-directory-metadata-action';
import { renderEmailByPath } from './render-email-by-path';
import { baseActionClient } from './safe-action';

export const exportSingleTemplate = baseActionClient
  .metadata({
    actionName: 'exportSingleTemplate',
  })
  .inputSchema(
    z.object({
      name: z.string(),
      html: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const response = await resend.templates.create({
      name: parsedInput.name,
      html: parsedInput.html,
    });

    if (response.error) {
      console.error('Error creating single template', response.error);
      return [{ name: parsedInput.name, status: 'failed' as const }];
    }

    return [
      {
        name: parsedInput.name,
        status: 'succeeded' as const,
        id: response.data.id,
      },
    ];
  });

export const bulkExportTemplates = baseActionClient
  .metadata({ actionName: 'bulkExportTemplates' })
  .action(async () => {
    try {
      const emailsDirectory = await getEmailsDirectoryMetadataAction(
        path.dirname(`${emailsDirectoryAbsolutePath}/emails`),
        true,
      );

      if (!emailsDirectory) {
        throw new Error('No emails directory found');
      }

      const results: {
        name: string;
        status: 'succeeded' | 'failed';
        id?: string;
        error?: string;
      }[] = [];

      const allDirectories = [
        emailsDirectory,
        ...emailsDirectory.subDirectories,
      ];

      for (const directory of allDirectories) {
        for (const filename of directory.emailFilenames) {
          try {
            const templateName = path.parse(filename).name;
            const renderingResult = await renderEmailByPath(
              path.join(directory.absolutePath, filename),
            );

            if ('error' in renderingResult) {
              throw new Error(renderingResult.error.message);
            }

            const resendResponse = await resend.templates.create({
              name: templateName,
              html: renderingResult.markup,
            });

            if (resendResponse.error) {
              results.push({
                name: templateName,
                status: 'failed' as const,
                error: resendResponse.error.message,
              });
            } else {
              results.push({
                name: templateName,
                status: 'succeeded' as const,
                id: resendResponse.data.id,
              });
            }

            await sleep(200);
          } catch (error) {
            results.push({
              name: filename,
              status: 'failed' as const,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
      }

      return results;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to bulk import templates');
    }
  });
