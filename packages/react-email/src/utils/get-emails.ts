import fs from 'node:fs/promises';
import path from 'node:path';

export const getEmails = async () => {
  const emailsPath = path.join(process.cwd(), 'emails');
  const emailPaths = await fs
    .readdir(emailsPath, { withFileTypes: true })
    .then((files) =>
      files
        .filter((file) => file.isFile() && file.name.endsWith('.tsx'))
        .map((file) => path.join(file.path, file.name)),
    );

  return emailPaths;
};
