import * as React from 'react';

type TextElement = React.ElementRef<'p'>;
type RootProps = React.ComponentPropsWithoutRef<'p'>;

export interface TextProps extends RootProps {}

export const Text = React.forwardRef<TextElement, Readonly<TextProps>>(
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

Text.displayName = 'Text';
