import * as React from 'react';

export type HrProps = Readonly<React.ComponentPropsWithoutRef<'hr'>>;

export const Hr = React.forwardRef<HTMLHRElement, HrProps>(
  ({ style, ...props }, ref) => (
    <hr
      {...props}
      ref={ref}
      style={{
        width: '100%',
        border: 'none',
        borderColor: 'transparent',
        borderTop: '1px solid #eaeaea',
        ...style,
      }}
    />
  ),
);

Hr.displayName = 'Hr';
