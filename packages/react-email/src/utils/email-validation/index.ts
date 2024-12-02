import { parse } from '@babel/parser';
import type { EmailValidationWarning } from '../../actions/get-warnings-for-email';
import { getUrlWarnings } from './get-url-warnings';
import { getImageWarnings } from './get-image-warnings';

export type AST = ReturnType<typeof parse>;

export const getValiationWarningsFor = async (
  code: string,
): Promise<EmailValidationWarning[]> => {
  const ast = parse(code, {
    plugins: ['jsx', 'typescript', 'decorators'],
    strictMode: false,
    ranges: true,
    sourceType: 'unambiguous',
  });

  const warnings: EmailValidationWarning[] = [];

  warnings.push(...(await getUrlWarnings(ast, code)));
  warnings.push(...getImageWarnings(ast, code));

  return warnings;
};
