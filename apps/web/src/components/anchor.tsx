import classNames from 'classnames';
import type * as React from 'react';

export function Anchor({ className, ...props }: React.ComponentProps<'a'>) {
  return (
    <a
      className={classNames(
        'rounded-sm outline-none transition-transform duration-200 ease-in-out',
        'hover:-translate-y-1',
        'focus:ring-2 focus:ring-white/20 focus:ring-offset-4 focus:ring-offset-black',
        'text-slate-12',
        className,
      )}
      {...props}
    >
      {props.children}
    </a>
  );
}
