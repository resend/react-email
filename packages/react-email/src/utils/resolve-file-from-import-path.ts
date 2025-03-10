import fs from 'node:fs';
import { type Result, err, ok } from './result';

export const resolveFileFromImportPath = async (
  importPath: string,
): Promise<Result<string, void>> => {
  if (fs.existsSync(`${importPath}.tsx`)) {
    return ok(`${importPath}.tsx`);
  }
  if (fs.existsSync(`${importPath}.jsx`)) {
    return ok(`${importPath}.jsx`);
  }
  if (fs.existsSync(`${importPath}.ts`)) {
    return ok(`${importPath}.ts`);
  }
  if (fs.existsSync(`${importPath}.js`)) {
    return ok(`${importPath}.js`);
  }

  return err();
};
