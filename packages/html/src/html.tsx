import * as React from 'react';

type HtmlElement = React.ElementRef<'html'>;
type RootProps = React.ComponentPropsWithoutRef<'html'>;

export interface HtmlProps extends RootProps {}

export const Html = React.forwardRef<HtmlElement, Readonly<HtmlProps>>(
  ({ children, lang = 'en', ...props }, forwardedRef) => (
    <html ref={forwardedRef} lang={lang} {...props}>
      {children}
    </html>
  ),
);

Html.displayName = 'Html';
