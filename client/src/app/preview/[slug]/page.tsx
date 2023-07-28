import { render } from '@react-email/render';
import { promises as fs } from 'fs';
import { getEmails } from '../../../utils/get-emails';
import Preview from './preview';

export const dynamicParams = true;

export async function generateStaticParams() {
  const { emails } = await getEmails();

  const paths = emails.map((email) => {
    return { slug: email };
  });

  return paths;
}

export default async function Page({ params }) {
  const { emails, paths } = await getEmails();

  const Email = (await import(`../../../../emails/${params.slug}.tsx`)).default;
  const markup = render(<Email />, { pretty: true });
  const plainText = render(<Email />, { plainText: true });

  const originalFilePath = paths.filter((path) => path.includes(params.slug))[0];

  const reactMarkup: string = await fs.readFile(originalFilePath, {
    encoding: 'utf-8',
  });

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
