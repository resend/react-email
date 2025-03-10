'use server';

import { ZodFirstPartyTypeKind, type ZodString } from 'zod';
import { type Result, err, ok } from '../utils/result';
import { getEmailComponent } from './build-email-component';

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

export type ControlsResult = Result<
  Control[] | undefined,
  'EMAIL_COMPONENT_NOT_BUILT'
>;

export const getEmailControls = async (
  emailSlug: string,
): Promise<ControlsResult> => {
  const emailComponentMetadata = await getEmailComponent(emailSlug);
  if (emailComponentMetadata === undefined) {
    return err('EMAIL_COMPONENT_NOT_BUILT');
  }

  const { emailComponent: Email } = emailComponentMetadata;
  if (!Email.PreviewSchema) return ok(undefined);

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

  return ok(controls);
};
