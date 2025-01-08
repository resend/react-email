'use server';

import type { Controls } from '../package';
import { cachedGetEmailComponent } from '../utils/cached-get-email-component';
import type { ErrorObject } from '../utils/types/error-object';

export type ControlsResult = { error: ErrorObject } | { controls: Controls };

export const getEmailControls = async (
  emailPath: string,
  invalidatingCache = false,
): Promise<ControlsResult> => {
  const result = await cachedGetEmailComponent(emailPath, invalidatingCache);
  if ('error' in result) {
    return { error: result.error };
  }

  const { emailComponent: Email } = result;

  return { controls: Email.controls ?? {} };
};
