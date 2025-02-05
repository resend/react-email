'use server';

import { ZodFirstPartyTypeKind, type ZodString } from 'zod';
import { cachedGetEmailComponent } from '../utils/cached-get-email-component';
import type { ErrorObject } from '../utils/types/error-object';

export type Control =
  | {
      key: string;
      type: 'email' | 'text' | 'checkbox' | 'number';
    }
  | {
      key: string;
      type: 'select';
      options: { name: string; value: string }[];
    };

export type ControlsResult =
  | { error: ErrorObject }
  | { controls: Control[] | undefined };

export const getEmailControls = async (
  emailPath: string,
  invalidatingCache = false,
): Promise<ControlsResult> => {
  const result = await cachedGetEmailComponent(emailPath, invalidatingCache);
  if ('error' in result) {
    return { error: result.error };
  }

  const { emailComponent: Email } = result;
  if (!Email.PreviewSchema) return { controls: undefined };

  const controls: Control[] = [];

  const propsShape = Email.PreviewSchema._def.shape();
  for (const key in propsShape) {
    const type = propsShape[key];
    if (type && 'typeName' in type._def) {
      switch (type._def.typeName) {
        case ZodFirstPartyTypeKind.ZodString:
          controls.push({
            key,
            type: (type as ZodString).isEmail ? 'email' : 'text',
          });
          break;
        case ZodFirstPartyTypeKind.ZodNumber:
          controls.push({
            key,
            type: 'number',
          });
          break;
        case ZodFirstPartyTypeKind.ZodBoolean:
          controls.push({
            key,
            type: 'checkbox',
          });
          break;
      }
    }
  }

  return { controls };
};
