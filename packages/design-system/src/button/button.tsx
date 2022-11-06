import classNames from 'classnames';
import * as React from 'react';
import { IconLoading } from '../icons';

interface ButtonDefaultProps {
  size?: '1' | '2' | '3';
  loading?: boolean;
}

interface ButtonProps
  extends Omit<React.ComponentPropsWithRef<'button'>, 'size'>,
    ButtonDefaultProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = '2', className, children, loading, ...props }, forwardedRef) => (
    <button
      ref={forwardedRef}
      className={classNames(
        className,
        'bg-white text-black font-semibold outline-none border border-white items-center inline-flex gap-1',
        'focus:ring-4 focus:ring-slate-600 transition ease-in-out duration-200',
        {
          'h-[24px] px-2 rounded-md text-sm': size === '1',
          'h-[32px] px-3 rounded-md text-sm': size === '2',
          'h-[44px] px-4 rounded-lg text-base': size === '3',
          'cursor-progress opacity-50': loading,
        },
      )}
      {...props}
    >
      {loading && <IconLoading />}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
