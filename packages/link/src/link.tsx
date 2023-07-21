import * as React from "react";

type LinkElement = React.ElementRef<"a">;
type RootProps = React.ComponentPropsWithoutRef<"a">;

export interface LinkProps extends RootProps {}

export const Link = React.forwardRef<LinkElement, Readonly<LinkProps>>(
  ({ target = "_blank", style, ...props }, forwardedRef) => (
    <a
      {...props}
      ref={forwardedRef}
      data-id="react-email-link"
      target={target}
      style={{
        color: "#067df7",
        textDecoration: "none",
        ...style,
      }}
    />
  ),
);

Link.displayName = "Link";
