import * as React from 'react';
import { cn } from '../../utils';

export type IconButtonProps = React.ComponentPropsWithoutRef<'button'>;

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Readonly<IconButtonProps>
>(({ children, className, ...props }, forwardedRef) => (
  <button
    type="button"
    {...props}
    className={cn(
      'focus:ring-gray-8 rounded text-slate-11 transition duration-200 ease-in-out hover:text-slate-12 focus:text-slate-12 focus:outline-none focus:ring-2',
      className,
    )}
    ref={forwardedRef}
  >
    {children}
  </button>
));

IconButton.displayName = 'IconButton';
