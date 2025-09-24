import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    SPAM_ASSASSIN_HOST: z.string().url(),
    SPAM_ASSASSIN_PORT: z.string(),
  },

  client: {},
  runtimeEnv: {
    SPAM_ASSASSIN_HOST: process.env.SPAM_ASSASSIN_HOST,
    SPAM_ASSASSIN_PORT: process.env.SPAM_ASSASSIN_PORT,
  },
});
