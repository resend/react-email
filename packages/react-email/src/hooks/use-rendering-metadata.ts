import { useEffect } from 'react';
import type {
  EmailRenderingResult,
  RenderedEmailMetadata,
} from '../actions/render-email-by-slug';

const lastRenderingMetadata = {} as Record<string, RenderedEmailMetadata>;

/**
 * Returns the rendering metadata if the given `renderingResult`
 * does not error. If it does error it returns the last value it had for the hook.
 */
export const useRenderingMetadata = (
  slug: string,
  renderingResult: EmailRenderingResult,
  initialRenderingMetadata?: EmailRenderingResult,
): RenderedEmailMetadata | undefined => {
  useEffect(() => {
    if ('markup' in renderingResult) {
      lastRenderingMetadata[slug] = renderingResult;
    } else if (
      typeof initialRenderingMetadata !== 'undefined' &&
      'markup' in initialRenderingMetadata &&
      typeof lastRenderingMetadata[slug] === 'undefined'
    ) {
      lastRenderingMetadata[slug] = initialRenderingMetadata;
    }
  }, [renderingResult, slug, initialRenderingMetadata]);

  return 'error' in renderingResult
    ? lastRenderingMetadata[slug]
    : renderingResult;
};
