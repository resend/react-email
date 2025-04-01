import * as React from 'react';
import { parseMargin } from './utils/parse-margins';

export type TextProps = Readonly<React.ComponentPropsWithoutRef<'p'>>;

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ style, ...props }, ref) => {
    const margins = parseMargin({
      margin: style?.margin,
      marginBottom: style?.marginBottom ?? '16px',
      marginTop: style?.marginTop ?? '16px',
      marginLeft: style?.marginLeft,
      marginRight: style?.marginRight,
    });

    return (
      <p
        {...props}
        ref={ref}
        style={{
          fontSize: '14px',
          lineHeight: '24px',
          ...style,
          marginBottom: margins.mb,
          marginTop: margins.mt,
          marginLeft: margins.ml,
          marginRight: margins.mr,
        }}
      />
    );
  },
);

Text.displayName = 'Text';
