import { promises as fs } from 'node:fs';
import path from 'node:path';
import { renderAsync } from '@react-email/render';
import { getEmailComponent } from '@/utils/get-email-component';
import { emailsDirPath, getEmailSlugs } from '@/utils/get-email-slugs';
import Preview from './preview';

export const dynamicParams = true;

interface Params {
  slug: string;
}

export default async function Page({ params }: { params: Params }) {
  const emailPath = path.join(emailsDirPath, params.slug);

  const Email = await getEmailComponent(emailPath);
  const previewProps = Email.PreviewProps || {};
  const markup = await renderAsync(<Email {...previewProps} />, {
    pretty: true,
  });
  const plainText = await renderAsync(<Email {...previewProps} />, {
    plainText: true,
  });

  const reactMarkup = await fs.readFile(emailPath, 'utf-8');

  return (
    <Preview
      emailSlugs={getEmailSlugs()}
      markup={markup}
      plainText={plainText}
      reactMarkup={reactMarkup}
      slug={params.slug}
    />
  );
}

export function generateMetadata({ params }: { params: Params }) {
  return { title: `${params.slug} — React Email` };
}
