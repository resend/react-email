import { Suspense } from 'react';
import { createErrorBoundary } from '../shared/error-boundary';
import type { Options } from '../shared/options';
import { pretty } from '../shared/utils/pretty';
import { toPlainText } from '../shared/utils/to-plain-text';
import { readStream } from './read-stream';

export const render = async (node: React.ReactNode, options?: Options) => {
  const reactDOMServer = await import('react-dom/server').then((m) => {
    if ('default' in m) {
      return m.default;
    }
    return m;
  });

  let html!: string;
  await new Promise<void>((resolve, reject) => {
    if (
      Object.hasOwn(reactDOMServer, 'renderToReadableStream') &&
      typeof WritableStream !== 'undefined'
    ) {
      const ErrorBoundary = createErrorBoundary(reject);
      reactDOMServer
        .renderToReadableStream(
          <ErrorBoundary>
            <Suspense>{node}</Suspense>
          </ErrorBoundary>,
          {
            progressiveChunkSize: Number.POSITIVE_INFINITY,
            onError(error) {
              // Throw immediately when an error occurs to prevent CSR fallback
              throw error;
            },
          },
        )
        .then((stream) => readStream(stream))
        .then((result) => {
          html = result;
          resolve();
        })
        .catch(reject);
    } else {
      const ErrorBoundary = createErrorBoundary(reject);
      const stream = reactDOMServer.renderToPipeableStream(
        <ErrorBoundary>
          <Suspense>{node}</Suspense>
        </ErrorBoundary>,
        {
          async onAllReady() {
            html = await readStream(stream);
            resolve();
          },
          onError(error) {
            reject(error);
          },
          onShellError(error) {
            reject(error);
          },
          progressiveChunkSize: Number.POSITIVE_INFINITY,
        },
      );
    }
  });

  if (options?.plainText) {
    return toPlainText(html, options.htmlToTextOptions);
  }

  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const document = `${doctype}${html.replace(/<!DOCTYPE.*?>/, '')}`;

  if (options?.pretty) {
    return pretty(document);
  }

  return document;
};
