import type { EmailValidationWarning } from '../../actions/get-warnings-for-email';
import { getUrlWarnings } from './get-url-warnings';

export const getValiationWarningsFor = (
  code: string
): Promise<EmailValidationWarning[]> => {
  return getUrlWarnings(code);
};
