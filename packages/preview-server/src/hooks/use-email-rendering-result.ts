import { useState } from 'react';
import { getEmailPathFromSlug } from '../actions/get-email-path-from-slug';
import {
  type EmailRenderingResult,
  renderEmailByPath,
} from '../actions/render-email-by-path';
import { isBuilding, isPreviewDevelopment } from '../app/env';
import { useEmails } from '../contexts/emails';
import { containsEmailTemplate } from '../utils/contains-email-template';
import { useHotreload } from './use-hot-reload';

export const useEmailRenderingResult = (
  emailPath: string,
  serverEmailRenderedResult: EmailRenderingResult,
) => {
  const [renderingResult, setRenderingResult] = useState(
    serverEmailRenderedResult,
  );

  const { emailsDirectoryMetadata } = useEmails();

  if (!isBuilding && !isPreviewDevelopment) {
    // biome-ignore lint/correctness/useHookAtTopLevel: This is fine since isBuilding does not change at runtime
    useHotreload(async (changes) => {
      for await (const change of changes) {
        const relativePathForChangedFile =
          // ex: apple-receipt.tsx
          // it will be the path relative to the emails directory, so it is already
          // going to be equivalent to the slug
          change.filename;

        if (
          !containsEmailTemplate(
            relativePathForChangedFile,
            emailsDirectoryMetadata,
          )
        ) {
          continue;
        }

        const pathForChangedEmail = await getEmailPathFromSlug(
          relativePathForChangedFile,
        );

        const newRenderingResult = await renderEmailByPath(
          pathForChangedEmail,
          true,
        );

        if (pathForChangedEmail === emailPath) {
          setRenderingResult(newRenderingResult);
        }
      }
    });
  }

  return renderingResult;
};
