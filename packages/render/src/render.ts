import * as ReactDomServer from "react-dom/server";
import { convert } from "html-to-text";
import { pretty } from "./utils/pretty";
import { plainTextSelectors } from "./plain-text-selectors";
import type { Options } from "./options";

export const render = (component: React.ReactElement, options?: Options) => {
  if (options?.plainText) {
    return renderAsPlainText(component, options);
  }
  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const markup = ReactDomServer.renderToStaticMarkup(component);
  const document = `${doctype}${markup}`;

  if (options && options.pretty) {
    return pretty(document);
  }

  return document;
};

const renderAsPlainText = (
  component: React.ReactElement,
  options?: Options,
) => {
  return convert(ReactDomServer.renderToStaticMarkup(component), {
    selectors: plainTextSelectors,
    ...(options?.plainText === true ? options.htmlToTextOptions : {}),
  });
};
