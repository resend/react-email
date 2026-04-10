import * as React from 'react';

export type ImgProps = Readonly<React.ComponentPropsWithoutRef<'img'>>;

export const Img = React.forwardRef<HTMLImageElement, ImgProps>(
  ({ alt, src, width, height, style, ...props }, ref) => (
    <img
      {...props}
      alt={alt}
      // Setting fetchPriority to "low" prevents React 19's SSR from
      // auto-injecting <link rel="preload"> tags for every image, which are
      // unnecessary noise in email HTML. Email clients ignore this attribute.
      fetchPriority="low"
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
