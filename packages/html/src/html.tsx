import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"html">;

export type HtmlProps = RootProps;

export const Html: React.FC<Readonly<HtmlProps>> = ({
  children,
  lang = "en",
  dir = "ltr",
  ...props
}) => (
  <html {...props} dir={dir} id="__react-email" lang={lang}>
    {children}
  </html>
);
