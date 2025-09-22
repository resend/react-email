import { Suspense } from 'react';
import { pretty, toPlainText } from '../node';
import type { Options } from '../shared/options';
import { readStream } from '../shared/read-stream.browser';

export const render = async (node: React.ReactNode, options?: Options) => {
  const suspendedElement = <Suspense>{node}</Suspense>;
  const reactDOMServer = await import('react-dom/server.browser').then(
    // This is beacuse react-dom/server is CJS
    (m) => m.default,
  );

  const html = await new Promise<string>((resolve, reject) => {
    reactDOMServer
      .renderToReadableStream(suspendedElement, {
        onError(error: unknown) {
          reject(error);
        },
        progressiveChunkSize: Number.POSITIVE_INFINITY,
      })
      .then(readStream)
      .then(resolve)
      .catch(reject);
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
