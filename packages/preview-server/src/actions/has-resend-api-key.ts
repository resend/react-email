'use server';

import { resendApiKey } from '../app/env';

export async function hasResendApiKey() {
  return (resendApiKey ?? '').trim().length > 0;
}
