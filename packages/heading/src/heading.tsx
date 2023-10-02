import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import type { As, Margin } from "./utils";
import { withMargin } from "./utils";

export type HeadingAs = As<"h1", "h2", "h3", "h4", "h5", "h6">;
export type HeadingProps = HeadingAs & Margin;

export const Heading: React.FC<Readonly<HeadingProps>> = ({
  as: Tag = "h1",
  children,
  style,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  ...props
}) => {
  return (
    <Slot
      {...props}
      style={{ ...withMargin({ m, mx, my, mt, mr, mb, ml }), ...style }}
    >
      <Tag>{children}</Tag>
    </Slot>
  );
};
