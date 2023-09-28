import { promises as fs, existsSync } from 'fs';
import path from 'path';

export const CONTENT_DIR = 'emails';

export const getEmails = async () => {
  const emailsDirectory = path.join(process.cwd(), CONTENT_DIR);
  if (!existsSync(emailsDirectory)) return { emails: [], filenames: [] };

  const filenames = await fs.readdir(emailsDirectory);
  const emails = filenames
    .map((file) => file.replace(/\.(jsx|tsx)$/g, ''))
    .filter((file) => file !== 'components');
  return { emails, filenames };
};
