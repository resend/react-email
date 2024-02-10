import * as React from "react";

type BodyElement = React.ElementRef<"body">;
type RootProps = React.ComponentPropsWithoutRef<"body">;

export type BodyProps = RootProps;

export const Body = React.forwardRef<BodyElement, Readonly<BodyProps>>(
  ({ children, style, ...props }, ref) => {
    return (
      <body {...props} ref={ref} style={style}>
        {children}
      </body>
    );
  },
);

Body.displayName = "Body";
