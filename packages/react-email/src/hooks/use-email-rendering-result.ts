import { useState } from 'react';
import { getEmailPathFromSlug } from '../actions/get-email-path-from-slug';
import {
  type EmailRenderingResult,
  renderEmailByPath,
} from '../actions/render-email-by-path';
import { isBuilding } from '../app/env';
import { useHotreload } from './use-hot-reload';
import { useEmails } from '../contexts/emails';
import { containsEmailTemplate } from '../utils/contains-email-template';

export const useEmailRenderingResult = (
  emailPath: string,
  serverEmailRenderedResult: EmailRenderingResult,
) => {
  const [renderingResult, setRenderingResult] = useState(
    serverEmailRenderedResult,
  );

  const { emailsDirectoryMetadata } = useEmails();

  if (!isBuilding) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotreload(async (changes) => {
      for await (const change of changes) {
        const slugForChangedEmail =
          // ex: apple-receipt.tsx
          // it will be the path relative to the emails directory, so it is already
          // going to be equivalent to the slug
          change.filename;

        if (containsEmailTemplate(slugForChangedEmail, emailsDirectoryMetadata)) {
          continue;
        }

        const pathForChangedEmail =
          await getEmailPathFromSlug(slugForChangedEmail);

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
