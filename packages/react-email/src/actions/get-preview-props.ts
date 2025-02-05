'use server';

import { cookies } from 'next/headers';
import { emailsDirectoryAbsolutePath } from '../utils/emails-directory-absolute-path';
import { cachedGetEmailComponent } from '../utils/cached-get-email-component';

export const getPreviewProps = async (emailPath: string) => {
  const cookieStore = await cookies();

  const emailSlug = emailPath.replace(`${emailsDirectoryAbsolutePath}/`, '');
  const previewPropsCoookieName = `preview-props-${emailSlug.replaceAll('/', '-')}`;
  const previewPropsCookie = cookieStore.get(previewPropsCoookieName);

  let previewProps: Record<string, unknown> = {};
  try {
    previewProps = JSON.parse(previewPropsCookie!.value) as Record<
      string,
      unknown
    >;
  } catch (exception) { }

  const componentResult = await cachedGetEmailComponent(emailPath);
  if ('emailComponent' in componentResult) {
    const { emailComponent: Email } = componentResult;

    if (Email.PreviewProps) {
      previewProps = { ...Email.PreviewProps, ...previewProps };
    }
  }

  return previewProps;
};
