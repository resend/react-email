import { Suspense } from 'react';
import { createErrorBoundary } from '../shared/error-boundary';
import type { Options } from '../shared/options';
import { readStream } from '../shared/read-stream.browser';
import { pretty } from '../shared/utils/pretty';
import { stripImagePreloadLinks } from '../shared/utils/strip-image-preload-links';
import { toPlainText } from '../shared/utils/to-plain-text';
import { unstableToPlainText } from '../shared/utils/unstable-to-plain-text';
import { importReactDom } from './import-react-dom';

export const render = async (
  element: React.ReactElement,
  options?: Options,
) => {
  const reactDOMServer = await importReactDom().then((m) => {
    if ('default' in m) {
      return m.default;
    }

    return m;
  });

  const html = await new Promise<string>((resolve, reject) => {
    const ErrorBoundary = createErrorBoundary(reject);
    const tree = (
      <ErrorBoundary>
        <Suspense>{element}</Suspense>
      </ErrorBoundary>
    );
    const renderOptions = {
      onError(error: unknown) {
        reject(error);
      },
      progressiveChunkSize: Number.POSITIVE_INFINITY,
    };
    const stream =
      'prerender' in reactDOMServer
        ? reactDOMServer
            .prerender(tree, renderOptions)
            .then(({ prelude }) => prelude)
        : reactDOMServer
            .renderToReadableStream(tree, renderOptions)
            .then(async (stream) => {
              await stream.allReady;
              return stream;
            });
    stream
      .then(readStream)
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
