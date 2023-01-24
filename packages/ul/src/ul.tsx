import * as React from 'react';

type UlElement = React.ElementRef<'ul'>;
type RootProps = React.ComponentPropsWithoutRef<'ul'>;

export interface UlProps extends RootProps {}

export const Ul = React.forwardRef<UlElement, Readonly<UlProps>>(
  ({ children, style, ...props }, forwardedRef) => (
    <ul
      ref={forwardedRef}
      style={{
        listStyleType: 'circle',
        ...style,
      }}
      {...props}
    >
      {children}
    </ul>
  ),
);

Ul.displayName = 'Ul';
