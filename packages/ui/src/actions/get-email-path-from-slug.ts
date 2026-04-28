'use server';

import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import { emailsDirectoryAbsolutePath } from '../app/env';

export const getEmailPathFromSlug = cache(async (slug: string) => {
  if (['.tsx', '.jsx', '.ts', '.js'].includes(path.extname(slug)))
    return path.join(emailsDirectoryAbsolutePath, slug);

  const pathWithoutExtension = path.join(emailsDirectoryAbsolutePath, slug);

  if (fs.existsSync(`${pathWithoutExtension}.tsx`)) {
    return `${pathWithoutExtension}.tsx`;
  }
  if (fs.existsSync(`${pathWithoutExtension}.jsx`)) {
    return `${pathWithoutExtension}.jsx`;
  }
  if (fs.existsSync(`${pathWithoutExtension}.ts`)) {
    return `${pathWithoutExtension}.ts`;
  }
  if (fs.existsSync(`${pathWithoutExtension}.js`)) {
    return `${pathWithoutExtension}.js`;
  }

  return undefined;
});
