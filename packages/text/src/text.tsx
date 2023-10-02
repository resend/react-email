import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"p">;

export type TextProps = RootProps;

export const Text: React.FC<Readonly<TextProps>> = ({ style, ...props }) => (
  <p
    {...props}
    data-id="react-email-text"
    style={{
      fontSize: "14px",
      lineHeight: "24px",
      margin: "16px 0",
      ...style,
    }}
  />
);
