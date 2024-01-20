import { getEmailPathFromSlug } from '../../../actions/get-email-path-from-slug';
import { getEmailsDirectoryMetadata } from '../../../actions/get-emails-directory-metadata';
import { renderEmailByPath } from '../../../actions/render-email-by-path';
import { emailsDirectoryAbsolutePath } from '../../../utils/emails-directory-absolute-path';
import Preview from './preview';

export const dynamicParams = true;

export interface PreviewParams {
  slug: string;
}

export default async function Page({ params }: { params: PreviewParams }) {
  // will come in here as a relative path to the email
  // ex: authentication/verify-password but encoded like authentication%20verify-password
  const slug = decodeURIComponent(params.slug);
  const emailsDirMetadata = await getEmailsDirectoryMetadata(
    emailsDirectoryAbsolutePath,
  );

  if (typeof emailsDirMetadata === 'undefined') {
    throw new Error(
      `Could not find the emails directory specified under ${emailsDirectoryAbsolutePath}!

This is most likely not an issue with the preview server. Maybe there was a typo on the "--dir" flag?`,
    );
  }

  const emailPath = await getEmailPathFromSlug(slug);

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
    <Preview
      emailPath={emailPath}
      renderingResult={emailRenderingResult}
      slug={slug}
    />
  );
}

export function generateMetadata({ params }: { params: PreviewParams }) {
  return { title: `${decodeURIComponent(params.slug)} — React Email` };
}
