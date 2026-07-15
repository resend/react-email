import * as React from 'react';
import { HtmlContext } from './html-context.js';

export type HtmlProps = Readonly<React.ComponentPropsWithoutRef<'html'>>;

export const Html = React.forwardRef<HTMLHtmlElement, HtmlProps>(
  ({ children, lang = 'en', dir = 'ltr', ...props }, ref) => {
    const html = (
      <html {...props} dir={dir} lang={lang} ref={ref}>
        {children}
      </html>
    );
    if (HtmlContext === undefined) {
      return html;
    }
    return (
      <HtmlContext.Provider value={{ lang, dir }}>{html}</HtmlContext.Provider>
    );
  },
);

Html.displayName = 'Html';
