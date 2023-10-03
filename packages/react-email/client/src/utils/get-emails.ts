import { promises as fs, existsSync } from 'fs';

export function emailsDir() {
  if (!process.env.EMAILS_PATH)
    throw new Error(`Could not find environment variable for EMAILS_PATH!
      This is necessary for the previewer to properly render the emails. Maybe you should be using react-emails's "email dev" instead of running manually?
      If you are not running manually, please open an issue about this so it can be fixed.`);
  return process.env.EMAILS_PATH;
}

export const getEmails = async () => {
  if (!existsSync(emailsDir())) return { emails: [], filenames: [] };

  const filenames = await fs.readdir(emailsDir());
  const emails = filenames
    .filter((file) => file !== '.preview')
    .map((file) => file.replace(/\.(jsx|tsx)$/g, ''))
    .filter((file) => file !== 'components');
  return { emails, filenames };
};
