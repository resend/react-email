import { Suspense } from 'react';
import path from 'node:path';
import { redirect } from 'next/navigation';
import { getEmailPathFromSlug } from '../../../actions/get-email-path-from-slug';
import { getEmailsDirectoryMetadata } from '../../../actions/get-emails-directory-metadata';
import { renderEmailByPath } from '../../../actions/render-email-by-path';
import { emailsDirectoryAbsolutePath } from '../../../utils/emails-directory-absolute-path';
import Home from '../../page';
import Preview from './preview';

export const dynamicParams = true;

export interface PreviewParams {
  slug: string[];
}

const Page = async ({ params }: { params: PreviewParams }) => {
  // will come in here as segments of a relative path to the email
  // ex: ['authentication', 'verify-password.tsx']
  const slug = params.slug.join('/');
  const emailsDirMetadata = await getEmailsDirectoryMetadata(
    emailsDirectoryAbsolutePath,
  );

  if (typeof emailsDirMetadata === 'undefined') {
    throw new Error(
      `Could not find the emails directory specified under ${emailsDirectoryAbsolutePath}!

This is most likely not an issue with the preview server. Maybe there was a typo on the "--dir" flag?`,
    );
  }

  let emailPath: string;
  try {
    emailPath = await getEmailPathFromSlug(slug);
  } catch (exception) {
    if (exception instanceof Error) {
      console.warn(exception.message);
      redirect('/');
    }
    throw exception;
  }

  const emailRenderingResult = await renderEmailByPath(emailPath);

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
      <Preview
        emailPath={emailPath}
        renderingResult={emailRenderingResult}
        slug={slug}
      />
    </Suspense>
  );
};

export function generateMetadata({ params }: { params: PreviewParams }) {
  return { title: `${path.basename(params.slug.join('/'))} — React Email` };
}

export default Page;
