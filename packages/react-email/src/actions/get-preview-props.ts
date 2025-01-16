'use server';

import { cookies } from 'next/headers';
import type { Controls } from '../package';

export const getPreviewProps = async (
  emailSlug: string,
  controls: Controls | undefined,
) => {
  const cookieStore = await cookies();

  const previewPropsCoookieName = `preview-props-${emailSlug.replaceAll('/', '-')}`;
  const previewPropsCookie = cookieStore.get(previewPropsCoookieName);

  let previewProps: Record<string, unknown>;
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    previewProps = JSON.parse(previewPropsCookie!.value) as Record<
      string,
      unknown
    >;
  } catch (exception) {
    previewProps = {};
    if (controls) {
      for (const [key, control] of Object.entries(controls)) {
        previewProps[key] = control?.defaultValue;
      }
    }
  }

  return previewProps;
};
