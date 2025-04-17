import * as React from 'react';
import { computeMargins } from './utils/compute-margins';

export type TextProps = Readonly<React.ComponentPropsWithoutRef<'p'>>;

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ style, ...props }, ref) => {
    const margins = computeMargins({
      marginBottom: '16px',
      marginTop: '16px',
      ...style,
    });

    return (
      <p
        {...props}
        ref={ref}
        style={{
          fontSize: '14px',
          lineHeight: '24px',
          ...style,
          ...margins,
        }}
      />
    );
  },
);

Text.displayName = 'Text';
