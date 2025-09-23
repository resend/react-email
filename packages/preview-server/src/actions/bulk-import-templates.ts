'use server';

import path from 'node:path';
import { resend } from '../lib/resend';
import type { EmailsDirectory } from '../utils/get-emails-directory-metadata';
import { getEmailsDirectoryMetadataAction } from './get-emails-directory-metadata-action';
import { renderEmailByPath } from './render-email-by-path';
import { baseActionClient } from './safe-action';
import z from 'zod';
import { getProperties } from '@react-email/render';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const exportSingleTemplate = baseActionClient
  .metadata({
    actionName: 'exportSingleTemplate',
  })
  .inputSchema(
    z.object({
      name: z.string(),
      html: z.string(),
      reactMarkup: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const extractedProperties = getProperties(parsedInput.reactMarkup) || [];

    const response = await resend.templates.create({
      name: parsedInput.name,
      html: parsedInput.html,
      variables: extractedProperties.map((variable) => ({
        key: variable.key,
        type: variable.type ?? 'string',
        fallback_value: variable.fallbackValue,
      })),
    });

    if (response.error) {
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
  .inputSchema(
    z.object({
      emailPath: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const emailsDirectory = await getEmailsDirectoryMetadataAction(
        path.dirname(parsedInput.emailPath),
        true,
      );
      if (!emailsDirectory) {
        throw new Error('No emails directory found');
      }

      const results = [] as {
        name: string;
        status: 'succeeded' | 'failed';
        id?: string;
        error?: string;
      }[];

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

            const response = await resend.templates.create({
              name: templateName,
              html: result.markup,
            });

            if (response.error) {
              results.push({
                name: templateName,
                status: 'failed' as const,
                error: response.error.message,
              });
            } else {
              results.push({
                name: templateName,
                status: 'succeeded' as const,
                id: response.data.id,
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
  });
