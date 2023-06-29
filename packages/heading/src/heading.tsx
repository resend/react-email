import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { As, Margin, withMargin } from "./utils";

interface HeadingOwnProps {}

export type HeadingAs = As<"h1", "h2", "h3", "h4", "h5", "h6">;
export type HeadingProps = HeadingAs & HeadingOwnProps & Margin;

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
        {...props}
        ref={forwardedRef}
        data-id="react-email-heading"
        style={{ ...withMargin({ m, mx, my, mt, mr, mb, ml }), ...style }}
      >
        <Tag>{children}</Tag>
      </Slot>
    );
  }
);

Heading.displayName = "Heading";
