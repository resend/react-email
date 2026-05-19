import * as React from 'react';

export type ImgProps = Readonly<React.ComponentPropsWithoutRef<'img'>>;

export const Img = React.forwardRef<HTMLImageElement, ImgProps>(
  ({ alt, src, width, height, style, ...props }, ref) => (
    <img
      {...props}
      alt={alt}
      height={height}
      ref={ref}
      src={src}
      style={{
        display: 'block',
        outline: 'none',
        border: 'none',
        textDecoration: 'none',
        ...style,
      }}
      width={width}
    />
  ),
);

Img.displayName = 'Img';
