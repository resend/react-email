'use server';

import { z } from 'zod';
import { resend } from '../lib/resend';
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
      return { name: parsedInput.name, status: 'failed' as const };
    }

    return {
      name: parsedInput.name,
      status: 'succeeded' as const,
      id: response.data.id,
    };
  });
