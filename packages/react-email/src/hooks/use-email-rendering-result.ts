import { useState } from 'react';
import { getEmailPathFromSlug } from '../actions/get-email-path-from-slug';
import { invalidateEmailComponentCache } from '../actions/invalidate-email-component-cache';
import {
  type EmailRenderingResult,
  invalidateComponentCache,
  invalidateRenderingCache,
  renderEmailByPath,
} from '../actions/render-email-by-path';
import { useHotreload } from './use-hot-reload';

export const useEmailRenderingResult = (
  emailPath: string,
  previewProps: Record<string, unknown>,
  serverEmailRenderedResult: EmailRenderingResult,
) => {
  const [renderingResult, setRenderingResult] = useState(
    serverEmailRenderedResult,
  );

  if (process.env.NEXT_PUBLIC_IS_BUILDING !== 'true') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotreload(async (changes) => {
      for await (const change of changes) {
        const slugForChangedEmail =
          // ex: apple-receipt.tsx
          // it will be the path relative to the emails directory, so it is already
          // going to be equivalent to the slug
          change.filename;

        const pathForChangedEmail =
          await getEmailPathFromSlug(slugForChangedEmail);

        await Promise.all([
          invalidateComponentCache(pathForChangedEmail),
          invalidateRenderingCache(pathForChangedEmail),
        ]);

        if (pathForChangedEmail === emailPath) {
          setRenderingResult(
            await renderEmailByPath(pathForChangedEmail, previewProps, {
              invalidatingComponentCache: true,
              invalidatingRenderingCache: true,
            }),
          );
        }
      }
    });
  }

  return [renderingResult, setRenderingResult] as const;
};
