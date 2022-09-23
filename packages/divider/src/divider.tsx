import * as React from "react";

type DividerElement = React.ElementRef<"hr">;
type RootProps = React.ComponentPropsWithoutRef<"hr">;

export interface DividerProps extends RootProps {}

export const Divider = React.forwardRef<DividerElement, Readonly<DividerProps>>(
  ({ style, ...props }, forwardedRef) => (
    <hr
      ref={forwardedRef}
      style={{
        width: "100%",
        border: "none",
        borderTop: "1px solid #eaeaea",
        margin: "26px 0",
        ...style,
      }}
      {...props}
    ></hr>
  )
);

Divider.displayName = "Divider";
