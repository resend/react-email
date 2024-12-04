import { parse } from '@babel/parser';

export const parseCode = (code: string) => {
  return parse(code, {
    plugins: ['jsx', 'typescript', 'decorators'],
    strictMode: false,
    ranges: true,
    sourceType: 'unambiguous',
  });
};
