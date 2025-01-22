'use server';
import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import { emailsDirectoryAbsolutePath } from '../utils/emails-directory-absolute-path';

// eslint-disable-next-line @typescript-eslint/require-await
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

  throw new Error(
    `Could not find your email file based on the slug (${slug}) by guessing the file extension. Tried .tsx, .jsx, .ts and .js.

    This is most likely not an issue with the preview server. It most likely is that the email doesn't exist.`,
  );
});
