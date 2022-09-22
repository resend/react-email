import * as ReactDomServer from 'react-dom/server';
import * as React from 'react';

export const render = (component: React.ReactElement) => {
  const doctype =
    '<!DOCTYPE htmlPUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
  const markup = ReactDomServer.renderToStaticMarkup(component);
  const document = `${doctype}${markup}`;

  return document;
};
