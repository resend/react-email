import * as React from 'react';

type UlElement = React.ElementRef<'ul'>;
type RootProps = React.ComponentPropsWithoutRef<'ul'>;

export interface UlProps extends RootProps {}

export const Ul = React.forwardRef<UlElement, Readonly<UlProps>>(
  ({ style, ...props }, forwardedRef) => (
    <ul ref={forwardedRef} style={style} {...props} />
  ),
);

Ul.displayName = 'Ul';
