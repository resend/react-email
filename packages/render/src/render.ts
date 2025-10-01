import * as ReactDomServer from 'react-dom/server';
import pretty from 'pretty';

interface Options {
  pretty?: boolean;
}

const decodeStyleAttributes = (html: string): string => {
  // Replace HTML entities in style attributes with their original characters
  // This is necessary because React's renderToStaticMarkup encodes quotes and ampersands
  // in attribute values, which can break CSS font-family declarations and URLs
  return html.replace(/style="([^"]*)"/g, (match, styleContent) => {
    const decoded = styleContent
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
    return `style="${decoded}"`;
  });
};

export const render = (component: React.ReactElement, options?: Options) => {
  const doctype =
    '<!DOCTYPE htmlPUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const markup = ReactDomServer.renderToStaticMarkup(component);
  const decodedMarkup = decodeStyleAttributes(markup);
  const document = `${doctype}${decodedMarkup}`;

  if (options && options.pretty) {
    return pretty(document);
  }

  return document;
};
