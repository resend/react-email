import classNames from 'classnames';
import Link from 'next/link';
import type * as React from 'react';
import { Logo } from './logo';
import { Menu } from './menu';

export const Topbar: React.FC<
  Readonly<React.ComponentPropsWithoutRef<'header'>>
> = ({ className, ...props }) => (
  <header
    className={classNames(
      'z-[3] flex items-center justify-between px-6 py-8',
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
