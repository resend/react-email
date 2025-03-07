import path from 'node:path';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getEmailControls } from '../../../actions/get-email-controls';
import { getPreviewProps } from '../../../actions/get-preview-props';
import { renderEmail } from '../../../actions/render-email';
import { getEmailsDirectoryMetadata } from '../../../utils/get-emails-directory-metadata';
import Home from '../../page';
import Preview from './preview';
import { getPreviewState } from './preview-state';
import { buildEmailComponent } from '../../../actions/build-email-component';
import { isBuilding, emailsDirectoryAbsolutePath } from '../../env';
import { isErr, serialize } from '../../../utils/result';

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

  const buildResult = await buildEmailComponent(slug);

  if (
    isErr(buildResult) &&
    buildResult.error.type === 'FAILED_TO_RESOLVE_PATH'
  ) {
    console.warn(`Could not resolve email path for ${slug}, redirecting to /`);
    redirect('/');
  }

  if (isErr(buildResult) && isBuilding) {
    throw new Error('Failed getting controls for email template', {
      cause: {
        slug,
        error: buildResult.error,
      },
    });
  }

  const controlsResult = await getEmailControls(slug);

  if (isErr(controlsResult) && isBuilding) {
    throw new Error('Failed getting controls for email template', {
      cause: {
        slug,
        error: controlsResult.error,
      },
    });
  }

  const previewProps = await getPreviewProps(slug);

  const renderingResult = await renderEmail(slug, previewProps);

  if (
    process.env.NEXT_PUBLIC_IS_BUILDING === 'true' &&
    isErr(renderingResult)
  ) {
    throw new Error('Failed rendering email by path', {
      cause: {
        slug,
        previewProps,
        error: renderingResult.error,
      },
    });
  }

  return (
    // This suspense is so that this page doesn't throw warnings
    // on the build of the preview server de-opting into
    // client-side rendering on build
    <Suspense fallback={<Home />}>
      <Preview
        pathSeparator={path.sep}
        previewState={getPreviewState(
          buildResult,
          controlsResult,
          renderingResult,
          previewProps,
        )}
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
