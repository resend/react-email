import * as React from 'react';

type ButtonElement = React.ElementRef<'a'>;
type RootProps = React.ComponentPropsWithoutRef<'a'>;

export interface ButtonProps extends RootProps {}

export const Button = React.forwardRef<ButtonElement, Readonly<ButtonProps>>(
  ({ children, style, ...props }, forwardedRef) => (
    <a
      ref={forwardedRef}
      dangerouslySetInnerHTML={{
        __html: `<!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:30pt" hidden>&nbsp;</i><![endif]--><span>${children}</span><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]-->`,
      }}
      style={style}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
