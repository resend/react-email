'use server';

import { cookies } from 'next/headers';
import { getEmailComponent } from './build-email-component';

export const getPreviewProps = async (emailSlug: string) => {
  const cookieStore = await cookies();

  const previewPropsCoookieName = `preview-props-${emailSlug.replaceAll('/', '-')}`;
  const previewPropsCookie = cookieStore.get(previewPropsCoookieName);

  let previewProps: Record<string, unknown> = {};
  try {
    previewProps = JSON.parse(previewPropsCookie!.value) as Record<
      string,
      unknown
    >;
  } catch (exception) {}

  const emailComponentMetadata = await getEmailComponent(emailSlug);
  if (emailComponentMetadata !== undefined) {
    const { emailComponent: Email } = emailComponentMetadata;

    if (Email.PreviewProps) {
      previewProps = { ...Email.PreviewProps, ...previewProps };
    }
  }

  return previewProps;
};
