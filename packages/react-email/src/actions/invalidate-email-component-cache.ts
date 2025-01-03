'use server';

import { componentCache } from '../utils/cached-get-email-component';

// eslint-disable-next-line @typescript-eslint/require-await
export const invalidateEmailComponentCache = async (emailPath: string) => {
  componentCache.delete(emailPath);
};
