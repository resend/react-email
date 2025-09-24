import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    spamAssassinHost: z.string(),
    spamAssassinPort: z.number(),
    tinybirdToken: z.string(),
  },

  client: {},
  runtimeEnv: {
    spamAssassinHost: process.env.SPAM_ASSASSIN_HOST,
    spamAssassinPort: process.env.SPAM_ASSASSIN_PORT,
    tinybirdToken: process.env.TINYBIRD_TOKEN,
  },
});
