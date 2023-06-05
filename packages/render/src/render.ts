import * as ReactDomServer from "react-dom/server";
import { convert } from "html-to-text";
import pretty from "pretty";

export interface Options {
  pretty?: boolean;
  plainText?: boolean;
}

export const render = (component: React.ReactElement, options?: Options) => {
  const markup = ReactDomServer.renderToStaticMarkup(component);
  if (options?.plainText) {
    return convertToPlainText(markup);
  }
  
  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const document = `${doctype}${markup}`;

  if (options && options.pretty) {
    return pretty(document);
  }

  return document;
};

export const convertToPlainText = (staticMarkup: string) => {
  return convert(staticMarkup, {
    selectors: [
      { selector: "img", format: "skip" },
      { selector: "#__react-email-preview", format: "skip" },
    ],
  });
};