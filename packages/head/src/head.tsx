import * as React from "react";

type HeadElement = React.ElementRef<"head">;
type RootProps = React.ComponentPropsWithoutRef<"head">;

export interface HeadProps extends RootProps {}

export const Head = React.forwardRef<HeadElement, Readonly<HeadProps>>(
  ({ children, ...props }, forwardedRef) => (
    <head {...props} ref={forwardedRef} data-id="__react-email-head">
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      {children}
    </head>
  )
);

Head.displayName = "Head";
