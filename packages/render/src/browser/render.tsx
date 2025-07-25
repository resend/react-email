import { convert } from 'html-to-text';
import { Suspense } from 'react';
import type { ReactDOMServerReadableStream } from 'react-dom/server';
import { pretty } from '../node';
import type { Options } from '../shared/options';
import { plainTextSelectors } from '../shared/plain-text-selectors';

const decoder = new TextDecoder('utf-8');

const readStream = async (stream: ReactDOMServerReadableStream) => {
  const chunks: Uint8Array[] = [];

  const writableStream = new WritableStream({
    write(chunk: Uint8Array) {
      chunks.push(chunk);
    },
    abort(reason) {
      throw new Error('Stream aborted', {
        cause: {
          reason,
        },
      });
    },
  });
  await stream.pipeTo(writableStream);

  let length = 0;
  chunks.forEach((item) => {
    length += item.length;
  });
  const mergedChunks = new Uint8Array(length);
  let offset = 0;
  chunks.forEach((item) => {
    mergedChunks.set(item, offset);
    offset += item.length;
  });

  return decoder.decode(mergedChunks);
};

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
    return convert(html, {
      selectors: plainTextSelectors,
      ...options.htmlToTextOptions,
    });
  }

  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const document = `${doctype}${html.replace(/<!DOCTYPE.*?>/, '')}`;

  if (options?.pretty) {
    return pretty(document);
  }

  return document;
};
