import * as React from 'react';

type PElement = React.ElementRef<'p'>;
type RootProps = React.ComponentPropsWithoutRef<'p'>;

export interface PProps extends RootProps {}

export const P = React.forwardRef<PElement, Readonly<PProps>>(
  ({ style, ...props }, forwardedRef) => (
    <p
      ref={forwardedRef}
      style={{
        fontSize: '14px',
        lineHeight: '24px',
        margin: '16px 0',
        ...style,
      }}
      {...props}
    />
  ),
);

P.displayName = 'P';
