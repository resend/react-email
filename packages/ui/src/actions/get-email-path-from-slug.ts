'use server';

import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import { emailsDirectoryAbsolutePath } from '../app/env';
import { isPathWithinEmailsDirectory } from '../utils/is-path-within-emails-directory';

const safeReturn = (candidate: string): string | undefined => {
  return isPathWithinEmailsDirectory(candidate) ? candidate : undefined;
};

export const getEmailPathFromSlug = cache(async (slug: string) => {
  if (['.tsx', '.jsx', '.ts', '.js', '.html'].includes(path.extname(slug)))
    return safeReturn(path.join(emailsDirectoryAbsolutePath, slug));

  const pathWithoutExtension = path.join(emailsDirectoryAbsolutePath, slug);

  if (fs.existsSync(`${pathWithoutExtension}.tsx`)) {
    return safeReturn(`${pathWithoutExtension}.tsx`);
  }
  if (fs.existsSync(`${pathWithoutExtension}.jsx`)) {
    return safeReturn(`${pathWithoutExtension}.jsx`);
  }
  if (fs.existsSync(`${pathWithoutExtension}.ts`)) {
    return safeReturn(`${pathWithoutExtension}.ts`);
  }
  if (fs.existsSync(`${pathWithoutExtension}.js`)) {
    return safeReturn(`${pathWithoutExtension}.js`);
  }
  if (fs.existsSync(`${pathWithoutExtension}.html`)) {
    return safeReturn(`${pathWithoutExtension}.html`);
  }

  return undefined;
});
