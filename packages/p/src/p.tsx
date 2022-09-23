import * as React from 'react';

type PElement = React.ElementRef<'p'>;
type RootProps = React.ComponentPropsWithoutRef<'p'>;

export interface PProps extends RootProps {}

export const P = React.forwardRef<PElement, Readonly<PProps>>(
  ({ style, ...props }, forwardedRef) => (
    <p
      ref={forwardedRef}
      style={{
        color: "#000",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        fontSize: "14px",
        lineHeight: "24px",
        ...style,
      }}
      {...props}
    />
  ),
);

P.displayName = 'P';
