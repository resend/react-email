'use server';

import { cookies } from 'next/headers';

export const updatePreviewProps = async (
  emailSlug: string,
  previewProps: Record<string, unknown>,
) => {
  const previewPropsCoookieName = `preview-props-${emailSlug.replaceAll('/', '-')}`;
  const cookieStore = await cookies();

  cookieStore.set(previewPropsCoookieName, JSON.stringify(previewProps));
};
