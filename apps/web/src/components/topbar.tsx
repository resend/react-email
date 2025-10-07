import classNames from 'classnames';
import Link from 'next/link';
import type * as React from 'react';
import { Logo } from './logo';
import { Menu } from './menu';

export function Topbar({
  className,
  ...props
}: Omit<React.ComponentProps<'header'>, 'children'>) {
  return (
    <header
      className={classNames(
        'relative z-50 flex items-center justify-between py-8 px-6 md:px-8',
        className,
      )}
      {...props}
    >
      <Link
        className="-ml-[.375rem] flex scroll-m-2 rounded-md pr-[.375rem] transition-colors focus:outline-none focus:ring focus:ring-slate-4"
        href="/"
      >
        <Logo />
      </Link>
      <Menu />
    </header>
  );
}
