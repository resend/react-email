import * as React from 'react';
import { computeMargins } from './utils/compute-margins';

export type TextProps = Readonly<React.ComponentPropsWithoutRef<'p'>>;

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ style, ...props }, ref) => {
    let modifiedStyle: React.CSSProperties = {};
    if (modifiedStyle.marginBottom === undefined) {
      modifiedStyle.marginBottom = '16px';
    }
    if (modifiedStyle.marginTop === undefined) {
      modifiedStyle.marginTop = '16px';
    }
    modifiedStyle = { ...modifiedStyle, ...style };
    const margins = computeMargins(modifiedStyle);

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
