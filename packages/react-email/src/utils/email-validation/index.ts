import type { EmailValidationWarning } from '../../actions/get-warnings-for-emails';
import { getUrlWarnings } from './get-url-warnings';

export const getValiationWarningsFor = (
  code: string,
  emailPath: string,
): Promise<EmailValidationWarning[]> => {
  return getUrlWarnings(code, emailPath);
};
