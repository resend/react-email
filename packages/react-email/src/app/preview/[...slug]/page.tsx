import path from 'node:path';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getPrerenderResumeDataCache } from 'next/dist/server/app-render/work-unit-async-storage.external';
import { getEmailPathFromSlug } from '../../../actions/get-email-path-from-slug';
import { renderEmailByPath } from '../../../actions/render-email-by-path';
import { emailsDirectoryAbsolutePath } from '../../../utils/emails-directory-absolute-path';
import { getEmailsDirectoryMetadata } from '../../../utils/get-emails-directory-metadata';
import Home from '../../page';
import { getEmailControls } from '../../../actions/get-email-controls';
import type { Controls } from '../../../package';
import { getPreviewProps } from '../../../actions/get-preview-props';
import Preview from './preview';

export const dynamicParams = true;

export const dynamic = 'force-dynamic';

export interface PreviewParams {
  slug: string[];
}

const Page = async ({
  params: paramsPromise,
}: {
  params: Promise<PreviewParams>;
}) => {
  const params = await paramsPromise;
  // will come in here as segments of a relative path to the email
  // ex: ['authentication', 'verify-password.tsx']
  const slug = decodeURIComponent(params.slug.join('/'));
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

  const controlsResult = await getEmailControls(emailPath);

  if (
    'error' in controlsResult &&
    process.env.NEXT_PUBLIC_IS_BUILDING === 'true'
  ) {
    throw new Error('Failed getting controls for email template', {
      cause: {
        emailPath,
        error: controlsResult.error,
      },
    });
  }

  const previewProps = await getPreviewProps(
    slug,
    'controls' in controlsResult ? controlsResult.controls : undefined,
  );

  const serverEmailRenderingResult = await renderEmailByPath(
    emailPath,
    previewProps,
  );

  if (
    process.env.NEXT_PUBLIC_IS_BUILDING === 'true' &&
    'error' in serverEmailRenderingResult
  ) {
    throw new Error('Failed rendering email by path', {
      cause: {
        emailPath,
        previewProps,
        error: serverEmailRenderingResult.error,
      },
    });
  }

  return (
    // This suspense is so that this page doesn't throw warnings
    // on the build of the preview server de-opting into
    // client-side rendering on build
    <Suspense fallback={<Home />}>
      <Preview
        serverControlsResult={controlsResult}
        emailPath={emailPath}
        pathSeparator={path.sep}
        previewProps={previewProps}
        serverRenderingResult={serverEmailRenderingResult}
        slug={slug}
      />
    </Suspense>
  );
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PreviewParams>;
}) {
  const { slug } = await params;

  return { title: `${path.basename(slug.join('/'))} — React Email` };
}

export default Page;
