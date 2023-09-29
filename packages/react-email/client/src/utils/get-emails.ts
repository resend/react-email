import { promises as fs, existsSync } from 'fs';

export const getEmails = async () => {
  const emailsDirectory = process.env.EMAILS_PATH;
  if (!emailsDirectory) throw new Error(`Could not find environment variable for EMAILS_PATH!
    This is necessary for the previewer to properly render the emails. Maybe you should be using react-emails's "email dev" instead of running manually?
    If you are not running manually, please open an issue about this so it can be fixed.`);
  if (!existsSync(emailsDirectory)) return { emails: [], filenames: [] };

  const filenames = await fs.readdir(emailsDirectory);
  const emails = filenames
    .map((file) => file.replace(/\.(jsx|tsx)$/g, ''))
    .filter((file) => file !== 'components');
  return { emails, filenames };
};
