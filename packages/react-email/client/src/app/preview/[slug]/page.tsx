import { promises as fs } from 'fs';
import { join as pathJoin } from 'path';
import { emailsDir, getEmails } from '../../../utils/get-emails';
import Preview from './preview';

export const dynamicParams = true;

export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  const { emails, filenames } = await getEmails();
  const template = filenames.find((email) => {
    const [fileName] = email.split('.');
    return params.slug === fileName;
  });

  if (!template)
    throw new Error(
      `Could not find email with slug that should be ${params.slug}`,
    );

  // this is not undefined because if it was, getEmails would have already thrown
  const basePath = emailsDir();

  const reactMarkup = await fs.readFile(pathJoin(basePath, template), {
    encoding: 'utf-8',
  });
  const markup = await fs.readFile(
    pathJoin(basePath, `.preview/${params.slug}.html`),
    { encoding: 'utf-8' },
  );
  const plainText = await fs.readFile(
    pathJoin(basePath, `.preview/${params.slug}.txt`),
    { encoding: 'utf-8' },
  );

  return (
    <Preview
      navItems={emails}
      slug={params.slug}
      markup={markup}
      reactMarkup={reactMarkup}
      plainText={plainText}
    />
  );
}

export async function generateMetadata({ params }) {
  return { title: `${params.slug} — React Email` };
}
