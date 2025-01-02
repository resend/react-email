'use server';

import type { Controls } from '../package';
import { getEmailComponent } from '../utils/get-email-component';
import type { ErrorObject } from '../utils/types/error-object';

export type ControlsResult = { error: ErrorObject } | { controls: Controls };

export const getEmailControls = async (
  emailPath: string,
): Promise<ControlsResult> => {
  const result = await getEmailComponent(emailPath);
  if ('error' in result) {
    return { error: result.error };
  }

  const { emailComponent: Email } = result;

  return { controls: Email.controls ?? {} };
};
