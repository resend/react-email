import { Suspense } from 'react';
import { getEmailsDirectoryMetadata } from '../../../actions/get-emails-directory-metadata';
import { renderEmailBySlug } from '../../../actions/render-email-by-slug';
import { emailsDirectoryAbsolutePath } from '../../../utils/emails-directory-absolute-path';
import Home from '../../page';
import Preview from './preview';

export const dynamicParams = true;

export interface PreviewParams {
  slug: string;
}

export default async function Page({ params }: { params: PreviewParams }) {
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

  const emailRenderingResult = await renderEmailBySlug(slug);

  if (
    'error' in emailRenderingResult &&
    process.env.NEXT_PUBLIC_IS_BUILDING === 'true'
  ) {
    throw new Error(emailRenderingResult.error.message, {
      cause: emailRenderingResult.error,
    });
  }

  return (
    // This suspense is so that this page doesn't throw warnings 
    // on the build of the preview server de-opting into 
    // client-side rendering on build
    <Suspense fallback={<Home />}>
      <Preview renderingResult={emailRenderingResult} slug={slug} />
    </Suspense>
  );
}

export function generateMetadata({ params }: { params: PreviewParams }) {
  return { title: `${decodeURIComponent(params.slug)} — React Email` };
}
