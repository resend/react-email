import * as ReactDomServer from 'react-dom/server';
import pretty from 'pretty';

interface Options {
  pretty?: boolean;
}

export const render = (component: React.ReactElement, options?: Options) => {
  const doctype =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const markup = ReactDomServer.renderToStaticMarkup(component);
  const document = `${doctype}${markup}`;

  if (options && options.pretty) {
    return pretty(document);
  }

  return document;
};
