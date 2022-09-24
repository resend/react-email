import * as React from 'react';

type OlElement = React.ElementRef<'ol'>;
type RootProps = React.ComponentPropsWithoutRef<'ol'>;

export interface OlProps extends RootProps {}

export const Ol = React.forwardRef<OlElement, Readonly<OlProps>>(
  ({ style, ...props }, forwardedRef) => (
    <ol ref={forwardedRef} style={style} {...props} />
  ),
);

Ol.displayName = 'Ol';
