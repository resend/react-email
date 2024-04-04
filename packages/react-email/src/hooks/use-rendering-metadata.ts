import { useEffect } from 'react';
import type {
  EmailRenderingResult,
  RenderedEmailMetadata,
} from '../actions/render-email-by-path';

const lastRenderingMetadataPerEmailPath = {} as Record<
  string,
  RenderedEmailMetadata
>;

/**
 * Returns the rendering metadata if the given `renderingResult`
 * does not error. If it does error it returns the last value it had for the hook.
 */
export const useRenderingMetadata = (
  emailPath: string,
  renderingResult: EmailRenderingResult,
  initialRenderingMetadata?: EmailRenderingResult,
): RenderedEmailMetadata | undefined => {
  useEffect(() => {
    if ('markup' in renderingResult) {
      lastRenderingMetadataPerEmailPath[emailPath] = renderingResult;
    } else if (
      typeof initialRenderingMetadata !== 'undefined' &&
      'markup' in initialRenderingMetadata &&
      typeof lastRenderingMetadataPerEmailPath[emailPath] === 'undefined'
    ) {
      lastRenderingMetadataPerEmailPath[emailPath] = initialRenderingMetadata;
    }
  }, [renderingResult, emailPath, initialRenderingMetadata]);

  return 'error' in renderingResult
    ? lastRenderingMetadataPerEmailPath[emailPath]
    : renderingResult;
};
