import { convert } from 'html-to-text';
import { Suspense } from 'react';
import { experimental_renderToHTML as renderToHTML } from 'react-markup';
import { pretty } from '../node';
import type { Options } from '../shared/options';
import { plainTextSelectors } from '../shared/plain-text-selectors';

export const render = async (node: React.ReactNode, options?: Options) => {
  const suspendedElement = <Suspense>{node}</Suspense>;

  const html = await renderToHTML(suspendedElement);

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
