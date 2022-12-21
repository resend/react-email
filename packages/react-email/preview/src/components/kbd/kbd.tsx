import * as React from 'react';

export interface KbdProps { }

type KbdElement = React.ElementRef<'kbd'>;
type RootProps = React.ComponentPropsWithoutRef<'kbd'>;

export interface KbdProps extends RootProps { }

export const Kbd = React.forwardRef<KbdElement, Readonly<KbdProps>>(
  ({ children }, forwardedRef) => (
    <kbd
      ref={forwardedRef}
      className="uppercase bg-slate-7 text-slate-11 rounded-md py-[2px] px-[6px] ml-1 text-xs"
    >
      {children}
    </kbd>
  ),
);

Kbd.displayName = 'Kbd';