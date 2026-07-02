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

const getRenderingKey = (
  emailPath: string,
  previewPropsOverride: Record<string, unknown> | undefined,
) =>
  previewPropsOverride === undefined
    ? emailPath
    : `${emailPath}\0${JSON.stringify(previewPropsOverride)}`;

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

  // The server render already covers the initial (path, default props) pair;
  // re-rendering is only needed when the pair changes. A key comparison keeps
  // Strict Mode's double-invoked effect from issuing a redundant render.
  const lastRenderedKey = useRef(getRenderingKey(emailPath, undefined));
  useEffect(() => {
    const key = getRenderingKey(emailPath, previewPropsOverride);
    if (key === lastRenderedKey.current) return;
    lastRenderedKey.current = key;

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
