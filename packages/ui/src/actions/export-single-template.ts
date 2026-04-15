'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import { resendApiKey } from '../app/env';
import { upsertResendTemplate } from '../utils/resend-template-upsert';
import { baseActionClient } from './safe-action';

export const exportSingleTemplate = baseActionClient
  .metadata({
    actionName: 'exportSingleTemplate',
  })
  .inputSchema(
    z.object({
      name: z.string(),
      legacyName: z.string().optional(),
      html: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const resend = new Resend(resendApiKey);

    const response = await upsertResendTemplate({
      resend,
      name: parsedInput.name,
      legacyName: parsedInput.legacyName,
      html: parsedInput.html,
    });

    if ('error' in response) {
      console.error('Error syncing single template', response.error);
      return { name: parsedInput.name, status: 'failed' as const };
    }

    return {
      name: parsedInput.name,
      status: 'succeeded' as const,
      id: response.id,
      operation: response.operation,
    };
  });
