import { Suspense } from 'react';
import { renderEmailBySlug } from '../../../actions/render-email-by-slug';
import { getEmailsDirectoryMetadata } from '../../../actions/get-emails-directory-metadata';
import { emailsDirectoryAbsolutePath } from '../../../utils/emails-directory-absolute-path';
import Preview from './preview';

export const dynamicParams = true;

interface Params {
  slug: string;
}

export default async function Page({ params }: { params: Params }) {
  // will come in here as a relative path to the email
  // ex: authentication/verify-password.tsx but encoded like authentication%20verify-password.tsx
  const slug = decodeURIComponent(params.slug);
  const emailsDirMetadata = await getEmailsDirectoryMetadata(
    emailsDirectoryAbsolutePath,
  );

  if (typeof emailsDirMetadata === 'undefined') {
    throw new Error(
      `Could not find the emails directory specified under ${emailsDirectoryAbsolutePath}!`,
    );
  }

  const { markup, reactMarkup, plainText } = await renderEmailBySlug(slug);

  return (
    <Suspense>
      <Preview
        markup={markup}
        plainText={plainText}
        reactMarkup={reactMarkup}
        slug={slug}
      />
    </Suspense>
  );
}

export function generateMetadata({ params }: { params: Params }) {
  return { title: `${decodeURIComponent(params.slug)} — React Email` };
}
