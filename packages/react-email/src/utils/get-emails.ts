import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

export const getEmails = async () => {
  const emailsDirPath = path.join(
    process.cwd(),
    process.env.EMAILS_DIR_RELATIVE_PATH ?? 'emails',
  );

  if (!existsSync(emailsDirPath)) return [];

  const emailPaths = await fs
    .readdir(emailsDirPath, { withFileTypes: true })
    .then((files) =>
      files
        .filter((file) => file.isFile() && file.name.endsWith('.tsx'))
        .map((file) => path.join(file.path, file.name)),
    );

  return emailPaths;
};
