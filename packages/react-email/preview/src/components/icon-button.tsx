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
      'rounded text-gray-11 focus:text-gray-12 ease-in-out transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-8 hover:text-gray-12',
      className,
    )}
  >
    {children}
  </button>
));

IconButton.displayName = 'IconButton';
