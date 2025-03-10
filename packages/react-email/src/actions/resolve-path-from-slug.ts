'use server';
import fs from 'node:fs';
import path from 'node:path';
import { emailsDirectoryAbsolutePath } from '../app/env';
import { type Result, err, ok } from '../utils/result';

export const resolvePathFromSlug = async (
  slug: string,
): Promise<Result<string, void>> => {
  if (['.tsx', '.jsx', '.ts', '.js'].includes(path.extname(slug))) {
    const pathWithExtension = path.join(emailsDirectoryAbsolutePath, slug);
    if (fs.existsSync(pathWithExtension)) {
      return ok(pathWithExtension);
    }
  } else {
    const pathWithoutExtension = path.join(emailsDirectoryAbsolutePath, slug);

    if (fs.existsSync(`${pathWithoutExtension}.tsx`)) {
      return ok(`${pathWithoutExtension}.tsx`);
    }
    if (fs.existsSync(`${pathWithoutExtension}.jsx`)) {
      return ok(`${pathWithoutExtension}.jsx`);
    }
    if (fs.existsSync(`${pathWithoutExtension}.ts`)) {
      return ok(`${pathWithoutExtension}.ts`);
    }
    if (fs.existsSync(`${pathWithoutExtension}.js`)) {
      return ok(`${pathWithoutExtension}.js`);
    }
  }

  return err();
};
