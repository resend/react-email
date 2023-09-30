import * as React from "react";

type HeadElement = React.ElementRef<"head">;
type RootProps = React.ComponentPropsWithoutRef<"head">;

export type HeadProps = RootProps;

export const Head = React.forwardRef<HeadElement, Readonly<HeadProps>>(
  ({ children, ...props }, forwardedRef) => (
    <head {...props} data-id="__react-email-head" ref={forwardedRef}>
      <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
      {children}
    </head>
  ),
);

Head.displayName = "Head";
