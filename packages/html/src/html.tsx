import * as React from 'react';

type RootProps = React.ComponentPropsWithoutRef<'html'>;

export interface HtmlProps extends RootProps {}

export const Html: React.FC<Readonly<HtmlProps>> = ({
  children,
  lang = 'en',
  ...props
}) => (
  <html lang={lang} {...props}>
    {children}
  </html>
);

Html.displayName = 'Html';
