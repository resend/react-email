import * as React from "react";

type RootProps = React.ComponentPropsWithoutRef<"img">;

export type ImgProps = RootProps;

export const Img: React.FC<Readonly<ImgProps>> = ({
  alt,
  src,
  width,
  height,
  style,
  ...props
}) => (
  <img
    {...props}
    alt={alt}
    data-id="react-email-img"
    height={height}
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
);
