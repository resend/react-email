import * as ReactDomServer from 'react-dom/server';
import pretty from 'pretty';

interface Options {
  pretty?: boolean;
}

const decodeHrefAttributes = (html: string): string => {
  // Replace HTML entities in href attributes with their original characters
  // This is necessary because React's renderToStaticMarkup encodes ampersands
  // in attribute values, which can break links with query parameters, particularly
  // on Azure's email service with click tracking enabled
  return html.replace(/href="([^"]*)"/g, (match, hrefContent) => {
    const decoded = hrefContent.replace(/&amp;/g, '&');
    return `href="${decoded}"`;
  });
};

export const render = (component: React.ReactElement, options?: Options) => {
  const doctype =
    '<!DOCTYPE htmlPUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const markup = ReactDomServer.renderToStaticMarkup(component);
  const decodedMarkup = decodeHrefAttributes(markup);
  const document = `${doctype}${decodedMarkup}`;

  if (options && options.pretty) {
    return pretty(document);
  }

  return document;
};
