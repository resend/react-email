'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import { fromAddress, resendApiKey } from '../app/env';
import { baseActionClient } from './safe-action';

export const sendEmail = baseActionClient
  .metadata({
    actionName: 'sendEmail',
  })
  .inputSchema(
    z.object({
      to: z.string().email(),
      subject: z.string().min(1),
      html: z.string(),
    }),
  )
  .action(async ({ parsedInput }) => {
    if (!resendApiKey) {
      return {
        status: 'failed' as const,
        error: 'Resend API key is not configured',
      };
    }

    if (!fromAddress) {
      return {
        status: 'failed' as const,
        error: 'Sender address is not configured. Use --from to set it.',
      };
    }

    const resend = new Resend(resendApiKey);

    const response = await resend.emails.send({
      from: fromAddress,
      to: [parsedInput.to],
      subject: parsedInput.subject,
      html: parsedInput.html,
    });

    if (response.error) {
      console.error('Error sending email', response.error);
      return { status: 'failed' as const, error: response.error.message };
    }

    return { status: 'succeeded' as const };
  });
