import * as React from 'react';

type HrElement = React.ElementRef<'hr'>;
type RootProps = React.ComponentPropsWithoutRef<'hr'>;

export interface HrProps extends RootProps {}

export const Hr = React.forwardRef<HrElement, Readonly<HrProps>>(
  ({ style, ...props }, forwardedRef) => (
    <hr
      ref={forwardedRef}
      style={{
        width: '100%',
        border: 'none',
        borderTop: '1px solid #eaeaea',
        ...style,
      }}
      {...props}
    />
  ),
);

Hr.displayName = 'Hr';
