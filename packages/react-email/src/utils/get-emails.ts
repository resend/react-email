import fs from 'node:fs';
import path from 'node:path';

export const getEmails = () => {
  const emailsDirPath = path.join(
    process.cwd(),
    process.env.EMAILS_DIR_RELATIVE_PATH ?? 'emails',
  );

  if (!fs.existsSync(emailsDirPath)) return [];

  return fs.readdirSync(emailsDirPath, { withFileTypes: true })
    .filter(
      (file) => file.isFile() && file.name.endsWith('.tsx'),
    )
    .map((file) => path.join(`${file.path}/${file.name}`));
};
