import * as React from 'react';

type RootProps = React.ComponentPropsWithoutRef<'html'>;

export interface HtmlProps extends RootProps {}

export const Html: React.FC<Readonly<HtmlProps>> = ({
  children,
  style,
  ...props
}) => <html {...props}>{children}</html>;

Html.displayName = 'Html';
