'use server';

import path from 'node:path';
import { getProperties, render } from '@react-email/render';
import z from 'zod';
import { emailsDirectoryAbsolutePath, emailsDirRelativePath } from '../app/env';
import { resend } from '../lib/resend';
import type { EmailsDirectory } from '../utils/get-emails-directory-metadata';
import { getEmailsDirectoryMetadataAction } from './get-emails-directory-metadata-action';
import { renderEmailByPath } from './render-email-by-path';
import { baseActionClient } from './safe-action';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const applyVariableMarkup = (
  html: string,
  variables: { key: string; fallbackValue: string }[],
) => {
  return variables.reduce((acc, variable) => {
    return acc.replace(
      `${variable.fallbackValue}`,
      `<span data-type="variable">{{{${variable.key}}}}</span>`,
    );
  }, html);
};

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

    const appliedVariableMarkup = applyVariableMarkup(
      parsedInput.html,
      extractedProperties.map((variable) => ({
        key: variable.key,
        fallbackValue: variable.fallbackValue as string,
      })),
    );

    const response = await resend.templates.create({
      name: parsedInput.name,
      html: appliedVariableMarkup,
      variables: extractedProperties.map((variable) => ({
        key: variable.key,
        type: variable.type ?? 'string',
        fallback_value: variable.fallbackValue,
      })),
    });

    if (response.error) {
      console.error(response.error);
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

      const results = [] as {
        name: string;
        status: 'succeeded' | 'failed';
        id?: string;
        error?: string;
      }[];

      const allDirectories = [
        emailsDirectory,
        ...emailsDirectory.subDirectories,
      ];

      for (const directory of allDirectories) {
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
      }

      return results;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to bulk import templates');
    }
  });
