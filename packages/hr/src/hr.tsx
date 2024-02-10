import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"hr">;

export type HrProps = RootProps;

export const Hr = React.forwardRef<React.ElementRef<"hr">, Readonly<HrProps>>(
  ({ style, ...props }, ref) => (
    <hr
      {...props}
      ref={ref}
      style={{
        width: "100%",
        border: "none",
        borderTop: "1px solid #eaeaea",
        ...style,
      }}
    />
  ),
);

Hr.displayName = "Hr";
