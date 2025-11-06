import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action';
import { z } from 'zod';

export const baseActionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({ actionName: z.string() });
  },
  handleServerError(error, options) {
    console.error(`Action error: ${options.metadata.actionName}`, error);
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
