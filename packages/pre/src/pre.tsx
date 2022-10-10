import * as React from 'react';

type PreElement = React.ElementRef<'pre'>;
type RootProps = React.ComponentPropsWithoutRef<'pre'>;

export interface PreProps extends RootProps {}

export const Pre = React.forwardRef<PreElement, Readonly<PreProps>>(
  ({ style, ...props }, forwardedRef) => (
    <pre ref={forwardedRef} style={style} {...props} />
  ),
);

Pre.displayName = 'Pre';
