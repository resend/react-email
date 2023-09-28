import { promises as fs } from 'fs';
import { join as pathJoin } from 'path';
import { CONTENT_DIR, getEmails } from '../../../utils/get-emails';
import Preview from './preview';

export const dynamicParams = true;

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const { emails } = await getEmails();

  const paths = emails.map((email) => {
    return { slug: email };
  });

  return paths;
}

export default async function Page({ params }) {
  const { emails, filenames } = await getEmails();
  const template = filenames.find((email) => {
    const [fileName] = email.split('.');
    return params.slug === fileName;
  });

  if (!template) throw new Error(`Could not find email with slug that should be ${params.slug}`);

  const basePath = pathJoin(process.cwd(), CONTENT_DIR);

  const reactMarkup = await fs.readFile(pathJoin(basePath, template), {
    encoding: 'utf-8',
  });
  const markup = await fs.readFile(
    pathJoin(basePath, `.react-email/${params.slug}.html`),
    { encoding: 'utf-8' },
  );
  const plainText = await fs.readFile(
    pathJoin(basePath, `.react-email/${params.slug}.txt`),
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
