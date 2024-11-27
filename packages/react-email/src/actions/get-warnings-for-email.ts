'use server';

import { promises as fs } from 'node:fs';
import { getValiationWarningsFor } from '../utils/email-validation';

export interface EmailValidationWarning {
  message: string;
  line: number;
  column: number;
}

export const getWarningsForEmail = async (
  emailPath: string,
) => {
  const code = await fs.readFile(emailPath, 'utf8');

  return getValiationWarningsFor(code);
};
