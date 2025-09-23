import { DEFAULT_USER_FACING_ERROR_MESSAGE, UserFacingError } from '@/errors';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

export const baseActionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({ actionName: z.string() });
  },
  handleServerError(error, options) {
    console.error(`Action error: ${options.metadata.actionName}`, error);

    if (error instanceof UserFacingError) {
      return error.message;
    }

    return DEFAULT_USER_FACING_ERROR_MESSAGE;
  },
});
