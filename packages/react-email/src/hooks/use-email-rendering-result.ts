import { useState } from 'react';
import {
  type EmailRenderingResult,
  renderEmail,
} from '../actions/render-email';
import { useHotreload } from './use-hot-reload';

export const useEmailRenderingResult = (
  emailSlug: string,
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
          change.filename.replace(/\.[^.]+$/, '');

        if (slugForChangedEmail === emailSlug) {
          setRenderingResult(await renderEmail(emailSlug, previewProps));
        }
      }
    });
  }

  return [renderingResult, setRenderingResult] as const;
};
