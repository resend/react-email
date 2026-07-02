import { useEffect, useRef, useState } from 'react';
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
  previewPropsOverride?: Record<string, unknown>,
) => {
  const [renderingResult, setRenderingResult] = useState(
    serverEmailRenderedResult,
  );

  // Keeps the hot reload callback below rendering with the latest override
  // without re-registering the socket listener.
  const previewPropsOverrideRef = useRef(previewPropsOverride);
  previewPropsOverrideRef.current = previewPropsOverride;

  const isFirstOverrideRun = useRef(true);
  useEffect(() => {
    // The server-rendered result already covers the initial default props.
    if (isFirstOverrideRun.current && previewPropsOverride === undefined) {
      isFirstOverrideRun.current = false;
      return;
    }
    isFirstOverrideRun.current = false;

    let cancelled = false;
    renderEmailByPath(emailPath, false, previewPropsOverride).then((result) => {
      if (!cancelled) {
        setRenderingResult(result);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [emailPath, previewPropsOverride]);

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

      // planHotReloadRerender only returns the currently-open preview as
      // pathToRerender, so re-render it with the active props override to keep
      // the props editor working across a hot reload.
      if (pathToRerender) {
        setRenderingResult(
          await renderEmailByPath(
            pathToRerender,
            true,
            previewPropsOverrideRef.current,
          ),
        );
      }
    });
  }

  return renderingResult;
};
