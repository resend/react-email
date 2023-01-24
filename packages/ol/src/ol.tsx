import * as React from 'react';

type OlElement = React.ElementRef<'ol'>;
type RootProps = React.ComponentPropsWithoutRef<'ol'>;

export interface OlProps extends RootProps {}

export const Ol = React.forwardRef<OlElement, Readonly<OlProps>>(
  ({ children, style, ...props }, forwardedRef) => (
    <ol
      ref={forwardedRef}
      style={{
        listStyleType: 'decimal-leading-zero',
        ...style,
      }}
      {...props}
    >
      {children}
    </ol>
  ),
);

Ol.displayName = 'Ol';
