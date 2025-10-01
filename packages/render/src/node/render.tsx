import { Suspense } from 'react';
import type { Options } from '../shared/options';
import { pretty } from '../shared/utils/pretty';
import { toPlainText } from '../shared/utils/to-plain-text';
import { readStream } from './read-stream';

export const render = async (node: React.ReactNode, options?: Options) => {
  const suspendedElement = <Suspense>{node}</Suspense>;
  const reactDOMServer = await import('react-dom/server').then(
    // This is beacuse react-dom/server is CJS
    (m) => m.default,
  );

  let html!: string;
  if (
    Object.hasOwn(reactDOMServer, 'renderToReadableStream') &&
    typeof WritableStream !== 'undefined'
  ) {
    html = await readStream(
      await reactDOMServer.renderToReadableStream(suspendedElement, {
        progressiveChunkSize: Number.POSITIVE_INFINITY,
      }),
    );
  } else {
    await new Promise<void>((resolve, reject) => {
      const stream = reactDOMServer.renderToPipeableStream(suspendedElement, {
        async onAllReady() {
          html = await readStream(stream);
          resolve();
        },
        onError(error) {
          reject(error as Error);
        },
        progressiveChunkSize: Number.POSITIVE_INFINITY,
      });
    });
  }

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
