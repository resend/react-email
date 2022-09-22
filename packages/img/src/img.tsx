import * as React from 'react';

type ImgElement = React.ElementRef<'img'>;
type RootProps = React.ComponentPropsWithoutRef<'img'>;

export interface ImgProps extends RootProps {}

export const Img = React.forwardRef<ImgElement, Readonly<ImgProps>>(
  ({ alt, src, width, height, style, ...props }, forwardedRef) => (
    <img
      ref={forwardedRef}
      alt={alt}
      src={src}
      width={width}
      height={height}
      style={{
        display: 'block',
        outline: 'none',
        border: 'none',
        textDecoration: 'none',
        ...style,
      }}
      {...props}
    />
  ),
);

Img.displayName = 'Img';
