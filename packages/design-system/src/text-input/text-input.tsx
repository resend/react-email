import * as React from 'react';
import classnames from 'classnames';

interface TextInputDefaultProps {
  size?: '1' | '2' | '3';
}

interface TextInputProps
  extends Omit<React.ComponentPropsWithRef<'input'>, 'size'>,
    TextInputDefaultProps {}

export const TextInput = React.forwardRef<
  HTMLInputElement,
  Readonly<TextInputProps>
>(({ className, size = '2', ...props }, forwardedRef) => (
  <input
    ref={forwardedRef}
    className={classnames(
      className,
      'bg-slate-700/50 text-white outline-none w-full border border-slate-700/50 items-center inline-flex',
      'focus:ring-4 focus:ring-slate-600',
      'placeholder:text-slate-500',
      {
        'h-[24px] px-2 rounded-md text-sm': size === '1',
        'h-[32px] px-3 rounded-md text-sm': size === '2',
        'h-[44px] px-3 rounded-lg text-base': size === '3',
      },
    )}
    type="text"
    {...props}
  />
));

TextInput.displayName = 'TextInput';
