'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import { resendApiKey } from '../app/env';
import { baseActionClient } from './safe-action';
import { uploadTemplateToResend } from './upload-template-to-resend';

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
  .action(({ parsedInput }) => {
    const resend = new Resend(resendApiKey);
    return uploadTemplateToResend(resend, parsedInput);
  });
