import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"head">;
type HeadElement = React.ElementRef<"head">;

export type HeadProps = RootProps;

export const Head = React.forwardRef<HeadElement, Readonly<HeadProps>>(
  ({ children, ...props }, ref) => (
    <head {...props} ref={ref}>
      <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
      <meta name="x-apple-disable-message-reformatting" />
      {children}
    </head>
  ),
);

Head.displayName = "Head";
