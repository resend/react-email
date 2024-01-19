import { getEmailsDirectoryMetadata } from '../../../actions/get-emails-directory-metadata';
import { renderEmailBySlug } from '../../../actions/render-email-by-slug';
import { emailsDirectoryAbsolutePath } from '../../../utils/emails-directory-absolute-path';
import Preview from './preview';

export const dynamicParams = true;

export interface PreviewParams {
  slug: string[];
}

export default async function Page({ params }: { params: PreviewParams }) {
  // will come in here as segments of a relative path to the email
  // ex: ['authentication', 'verify-password.tsx']
  const slug = params.slug.join('/');
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

  return <Preview renderingResult={emailRenderingResult} slug={slug} />;
}

export function generateMetadata({ params }: { params: PreviewParams }) {
  return { title: `${params.slug.join('/')} — React Email` };
}
