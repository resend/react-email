import * as React from 'react';

export type TextProps = Readonly<React.ComponentPropsWithoutRef<'p'>>;

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ style, ...props }, ref) => (
    <p
      {...props}
      ref={ref}
      style={{
        fontSize: '14px',
        lineHeight: '24px',
        margin: '16px 0',
        ...style,
      }}
    />
  ),
);

Text.displayName = 'Text';
