import { promises as fs } from 'fs';
import Home from './home';
import path from 'path';

export const CONTENT_DIR = 'emails';

const getEmails = async () => {
  const emailsDirectory = path.join(process.cwd(), CONTENT_DIR);

  const filenames = await fs.readdir(emailsDirectory);
  const emails = filenames
    .map((file) => file.replace(/\.(jsx|tsx)$/g, ''))
    .filter((file) => file !== 'components');

  return emails;
};

export default async function Index() {
  const emails = await getEmails();
  return <Home navItems={emails} />;
}

export const metadata = {
  title: 'React Email',
};
