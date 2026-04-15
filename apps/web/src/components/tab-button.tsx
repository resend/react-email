import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';

type TabButtonOwnProps<T extends React.ElementType> = {
  active?: boolean;
  as?: T;
  asChild?: boolean;
};

type TabButtonProps<T extends React.ElementType = 'button'> =
  TabButtonOwnProps<T> &
    Omit<
      React.ComponentPropsWithRef<T>,
      keyof TabButtonOwnProps<T>
    >;

export function TabButton<T extends React.ElementType = 'button'>({
  as,
  asChild = false,
  active,
  className,
  children,
  ...rest
}: TabButtonProps<T>) {
  const Comp = (asChild ? Slot : as ?? 'button') as React.ElementType;
  const defaultButtonProps =
    !asChild && !as ? ({ type: 'button' } as const) : undefined;

  return React.createElement(
    Comp,
    {
      className: classNames(
        'inline-flex w-full items-center justify-center px-2 md:w-fit',
        'inline-flex h-8 scroll-m-2 items-center rounded-md text-slate-11 text-sm transition-colors hover:bg-slate-6 hover:text-slate-12 focus:bg-slate-6 focus:outline-hidden focus:ring-3 focus:ring-slate-3 md:justify-center',
        'data-[active=true]:bg-slate-6 data-[active=true]:text-slate-12',
        className,
      ),
      'data-active': active,
      ...defaultButtonProps,
      ...rest,
    },
    children,
  );
}
