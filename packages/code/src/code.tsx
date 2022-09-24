import * as React from 'react';

type CodeElement = React.ElementRef<'code'>;
type RootProps = React.ComponentPropsWithoutRef<'code'>;

export interface CodeProps extends RootProps {}

export const Code = React.forwardRef<CodeElement, Readonly<CodeProps>>(
  ({ style, ...props }, forwardedRef) => (
    <code ref={forwardedRef} style={style} {...props} />
  ),
);

Code.displayName = 'Code';
