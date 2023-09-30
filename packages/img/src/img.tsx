import * as React from "react";

type ImgElement = React.ElementRef<"img">;
type RootProps = React.ComponentPropsWithoutRef<"img">;

export type ImgProps = RootProps;

export const Img = React.forwardRef<ImgElement, Readonly<ImgProps>>(
  ({ alt, src, width, height, style, ...props }, forwardedRef) => (
    <img
      {...props}
      alt={alt}
      data-id="react-email-img"
      height={height}
      ref={forwardedRef}
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
  ),
);

Img.displayName = "Img";
