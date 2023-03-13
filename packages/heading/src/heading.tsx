import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { As, Margin, withMargin } from "../../utils";

interface HeadingOwnProps {}

type HeadingAs = As<"h1", "h2", "h3", "h4", "h5", "h6">;
type HeadingProps = HeadingAs & HeadingOwnProps & Margin;

export const Heading = React.forwardRef<
  HTMLHeadingElement,
  Readonly<HeadingProps>
>(
  (
    { as: Tag = "h1", children, style, m, mx, my, mt, mr, mb, ml, ...props },
    forwardedRef
  ) => {
    return (
      <Slot
        ref={forwardedRef}
        style={{ ...withMargin({ m, mx, my, mt, mr, mb, ml }), ...style }}
        {...props}
      >
        <Tag>{children}</Tag>
      </Slot>
    );
  }
);

Heading.displayName = "Heading";
