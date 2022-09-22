import * as React from 'react';

type AElement = React.ElementRef<'a'>;
type RootProps = React.ComponentPropsWithoutRef<'a'>;

export interface AProps extends RootProps {}

export const A = React.forwardRef<AElement, Readonly<AProps>>(
  ({ target = '_blank', style, ...props }, forwardedRef) => (
    <a
      ref={forwardedRef}
      target={target}
      style={{
        color: '#067df7',
        textDecoration: 'none',
        ...style,
      }}
      {...props}
    />
  ),
);

A.displayName = 'A';
