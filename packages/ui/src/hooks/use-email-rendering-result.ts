import { useState } from 'react';
import { getEmailPathFromSlug } from '../actions/get-email-path-from-slug';
import {
  type EmailRenderingResult,
  invalidateEmailRenderingCache,
  renderEmailByPath,
} from '../actions/render-email-by-path';
import { isBuilding, isPreviewDevelopment } from '../app/env';
import { useEmails } from '../contexts/emails';
import { planHotReloadRerender } from '../utils/plan-hot-reload-rerender';
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
    useHotreload(async (changes) => {
      const { pathToRerender, pathsToInvalidate } = await planHotReloadRerender(
        changes,
        emailPath,
        emailsDirectoryMetadata,
        getEmailPathFromSlug,
      );

      for (const staleEmailPath of pathsToInvalidate) {
        await invalidateEmailRenderingCache(staleEmailPath);
      }

      if (pathToRerender) {
        setRenderingResult(await renderEmailByPath(pathToRerender, true));
      }
    });
  }

  return renderingResult;
};
