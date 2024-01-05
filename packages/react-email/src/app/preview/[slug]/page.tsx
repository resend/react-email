import Preview from './preview';
import { getEmailSlugs } from '@/utils/get-email-slugs';
import { renderEmailBySlug } from '@/utils/actions/render-email-by-slug';

export const dynamicParams = true;

interface Params {
  slug: string;
}

export default async function Page({ params }: { params: Params }) {
  const { markup, reactMarkup, plainText } = await renderEmailBySlug(
    params.slug,
  );

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
