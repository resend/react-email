import * as React from 'react';

type LiElement = React.ElementRef<'li'>;
type RootProps = React.ComponentPropsWithoutRef<'li'>;

export interface LiProps extends RootProps {}

export const Li = React.forwardRef<LiElement, Readonly<LiProps>>(
  ({ children, style, ...props }, forwardedRef) => (
    <li
      ref={forwardedRef}
      style={{
        ...style,
      }}
      {...props}
    >
      {children}
    </li>
  ),
);

Li.displayName = 'Li';
