import classnames from 'classnames';
import * as React from 'react';

export interface IconButtonProps
  extends React.ComponentPropsWithoutRef<'button'> {}

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Readonly<IconButtonProps>
>(({ children, className, ...props }, forwardedRef) => (
  <button
    {...props}
    ref={forwardedRef}
    className={classnames(
      'text-slate-11 focus:text-slate-12 focus:ring-slate-8 hover:text-slate-12 rounded transition duration-200 ease-in-out focus:outline-none focus:ring-2',
      className,
    )}
  >
    {children}
  </button>
));

IconButton.displayName = 'IconButton';
