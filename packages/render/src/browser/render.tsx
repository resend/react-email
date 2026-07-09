import { Suspense } from 'react';
import { pretty, toPlainText, unstableToPlainText } from '../node';
import { createErrorBoundary } from '../shared/error-boundary';
import type { Options } from '../shared/options';
import { readStream } from '../shared/read-stream.browser';
import { stripImagePreloadLinks } from '../shared/utils/strip-image-preload-links';

export const render = async (node: React.ReactNode, options?: Options) => {
  const reactDOMServer = await import('react-dom/server').then((m) => {
    if ('default' in m) {
      return m.default;
    }
    return m;
  });

  const html = await new Promise<string>((resolve, reject) => {
    const ErrorBoundary = createErrorBoundary(reject);
    reactDOMServer
      .renderToReadableStream(
        <Suspense>
          <ErrorBoundary>{node}</ErrorBoundary>
        </Suspense>,
        {
          onError(error: unknown) {
            reject(error);
          },
          progressiveChunkSize: Number.POSITIVE_INFINITY,
        },
      )
      .then(async (stream) => {
        await stream.allReady;
        return readStream(stream);
      })
      .then((result) => resolve(stripImagePreloadLinks(result)))
      .catch(reject);
  });

  if (options?.plainText) {
    return options.unstableTextConversion
      ? unstableToPlainText(html)
      : toPlainText(html, options.htmlToTextOptions);
  }

  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const document = `${doctype}${html.replace(/<!DOCTYPE.*?>/, '')}`;

  if (options?.pretty) {
    return pretty(document);
  }

  return document;
};
