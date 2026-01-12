import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    USER_PROJECT_LOCATION: z.string(),
    PREVIEW_SERVER_LOCATION: z.string(),
    EMAILS_DIR_ABSOLUTE_PATH: z.string(),
    RESEND_API_KEY: z.string().optional(),
    COMPATIBILITY_EMAIL_CLIENTS: z.string(),
  },
  client: {
    NEXT_PUBLIC_IS_BUILDING: z
      .union([z.literal('true'), z.literal('false')])
      .optional()
      .default('false'),
    NEXT_PUBLIC_IS_PREVIEW_DEVELOPMENT: z
      .union([z.literal('true'), z.literal('false')])
      .optional()
      .default('false'),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_IS_BUILDING: process.env.NEXT_PUBLIC_IS_BUILDING,
    NEXT_PUBLIC_IS_PREVIEW_DEVELOPMENT:
      process.env.NEXT_PUBLIC_IS_PREVIEW_DEVELOPMENT,
  },
});
