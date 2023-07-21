import * as React from "react";

type HtmlElement = React.ElementRef<"html">;
type RootProps = React.ComponentPropsWithoutRef<"html">;

export interface HtmlProps extends RootProps {}

export const Html = React.forwardRef<HtmlElement, Readonly<HtmlProps>>(
  ({ children, lang = "en", dir = "ltr", ...props }, forwardedRef) => (
    <html
      {...props}
      id="__react-email"
      ref={forwardedRef}
      lang={lang}
      dir={dir}
    >
      {children}
    </html>
  ),
);

Html.displayName = "Html";
