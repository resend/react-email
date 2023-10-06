import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"a">;

export type LinkProps = RootProps;

export const Link: React.FC<Readonly<LinkProps>> = ({
  target = "_blank",
  style,
  ...props
}) => (
  <a
    {...props}
    style={{
      color: "#067df7",
      textDecoration: "none",
      ...style,
    }}
    target={target}
  >
    {props.children}
  </a>
);
