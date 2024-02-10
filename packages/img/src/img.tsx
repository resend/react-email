import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"img">;

export type ImgProps = RootProps;

export const Img = React.forwardRef<
  React.ElementRef<"img">,
  Readonly<ImgProps>
>(({ alt, src, width, height, style, ...props }, ref) => (
  <img
    {...props}
    alt={alt}
    height={height}
    ref={ref}
    src={src}
    style={{
      display: "block",
      outline: "none",
      border: "none",
      textDecoration: "none",
      ...style,
    }}
    width={width}
  />
));

Img.displayName = "Img";
