import classNames from 'classnames';
import type * as React from 'react';

type IconButtonProps = React.ComponentPropsWithoutRef<'button'>;

export const IconButton: React.FC<Readonly<IconButtonProps>> = ({
  children,
  className,
  ...props
}) => (
  <button
    {...props}
    className={classNames(
      'rounded p-1 text-[#EEF7FE] transition duration-200 ease-in-out hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-slate-6',
      className,
    )}
    type="button"
  >
    {children}
  </button>
);
