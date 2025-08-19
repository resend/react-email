import { Suspense } from 'react';
import { pretty } from '../node';
import type { Options } from '../shared/options';
import { readStream } from '../shared/read-stream.browser';
import { toPlainText } from '../shared/utils/to-plain-text';
import { importReactDOM } from './import-react-dom';

export const render = async (
  element: React.ReactElement,
  options?: Options,
) => {
  const suspendedElement = <Suspense>{element}</Suspense>;
  const reactDOMServer = await importReactDOM().then(
    // This is beacuse react-dom/server is CJS
    (m) => m.default,
  );
  console.log(reactDOMServer);

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
