import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"a">;

export type LinkProps = RootProps;

export const Link = React.forwardRef<
  React.ElementRef<"a">,
  Readonly<LinkProps>
>(({ target = "_blank", style, ...props }, ref) => (
  <a
    {...props}
    ref={ref}
    style={{
      color: "#067df7",
      textDecoration: "none",
      ...style,
    }}
    target={target}
  >
    {props.children}
  </a>
));

Link.displayName = "Link";
