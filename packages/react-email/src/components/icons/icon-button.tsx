import * as React from 'react';
import { cn } from '../../utils';

export type IconButtonProps = React.ComponentPropsWithRef<'button'>;

export const IconButton = ({
  children,
  ref,
  className,
  ...props
}: IconButtonProps) => (
  <button
    type="button"
    {...props}
    className={cn(
      'rounded text-slate-11 focus:text-slate-12 ease-in-out transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-8 hover:text-slate-12',
      className,
    )}
    ref={ref}
  >
    {children}
  </button>
);

IconButton.displayName = 'IconButton';
