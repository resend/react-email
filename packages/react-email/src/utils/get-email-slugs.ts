import fs from 'node:fs';
import path from 'node:path';

export const emailsDirPath = path.join(
  process.cwd(),
  process.env.EMAILS_DIR_RELATIVE_PATH ?? 'emails',
);

export const getEmailSlugs = () => {
  if (!fs.existsSync(emailsDirPath)) return [];

  return fs
    .readdirSync(emailsDirPath, { withFileTypes: true })
    .filter(
      (file) =>
        file.isFile() &&
        (file.name.endsWith('.tsx') || file.name.endsWith('.jsx')),
    )
    .map((file) =>
      path.join(`${file.path}/${file.name}`).replace(`${emailsDirPath}/`, ''),
    );
};
