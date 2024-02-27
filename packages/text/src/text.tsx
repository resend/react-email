import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"p">;

export type TextProps = RootProps;

export const Text = React.forwardRef<
  React.ElementRef<"p">,
  Readonly<TextProps>
>(({ style, ...props }, ref) => (
  <p
    {...props}
    ref={ref}
    style={{
      fontSize: "14px",
      lineHeight: "24px",
      margin: "16px 0",
      ...style,
    }}
  />
));

Text.displayName = "Text";
