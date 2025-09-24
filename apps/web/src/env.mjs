import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    spamAssassinHost: z.string(),
    spamAssassinPort: z.number(),
  },

  client: {},
  runtimeEnv: {
    spamAssassinHost: process.env.SPAM_ASSASSIN_HOST,
    spamAssassinPort: process.env.SPAM_ASSASSIN_PORT,
  },
});
