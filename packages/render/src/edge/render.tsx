import { Suspense } from 'react';
import { pretty } from '../node';
import type { Options } from '../shared/options';
import { renderToReadableStream } from '../shared/render-to-readable-stream';
import { toPlainText } from '../shared/utils/to-plain-text';
import { importReactDom } from './import-react-dom';

export const render = async (
  element: React.ReactElement,
  options?: Options,
) => {
  const suspendedElement = <Suspense>{element}</Suspense>;
  const reactDOMServer = await importReactDom().then((m) => {
    if ('default' in m) {
      return m.default;
    }

    return m;
  });

  const html = await renderToReadableStream(suspendedElement, reactDOMServer);

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
