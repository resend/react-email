import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"html">;

export type HtmlProps = RootProps;

export const Html = React.forwardRef<
  React.ElementRef<"html">,
  Readonly<HtmlProps>
>(({ children, lang = "en", dir = "ltr", ...props }, ref) => (
  <html {...props} dir={dir} lang={lang} ref={ref}>
    {children}
  </html>
));

Html.displayName = "Html";
