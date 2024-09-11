import { convert } from "html-to-text";
import { experimental_renderToHTML as renderToHTML } from "react-markup";
import { Suspense } from "react";
import { pretty } from "./shared/utils/pretty";
import { plainTextSelectors } from "./shared/plain-text-selectors";
import type { Options } from "./shared/options";

export const render = async (
  element: React.ReactElement,
  options?: Options,
) => {
  const suspendedElement = <Suspense>{element}</Suspense>;

  const html: string = await renderToHTML(suspendedElement);

  if (options?.plainText) {
    return convert(html, {
      selectors: plainTextSelectors,
      ...options.htmlToTextOptions,
    });
  }

  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

  const document = `${doctype}${html.replace(/<!DOCTYPE.*?>/, "")}`;

  if (options?.pretty) {
    return pretty(document);
  }

  return document;
};
