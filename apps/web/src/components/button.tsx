import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import * as React from 'react';
import { unreachable } from '../utils/unreachable';

type Appearance = 'white' | 'gradient';
type Size = '1' | '2' | '3' | '4';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
  appearance?: Appearance;
  size?: Size;
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  Readonly<ButtonProps>
>(
  (
    {
      asChild,
      appearance = 'white',
      className,
      children,
      size = '2',
      ...props
    },
    forwardedRef,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={classNames(
          getSize(size),
          getAppearance(appearance),
          'inline-flex items-center justify-center border font-medium',
          className,
        )}
        ref={forwardedRef}
        type="button"
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

const getAppearance = (appearance: Appearance) => {
  switch (appearance) {
    case 'white':
      return [
        'bg-white text-black',
        'hover:bg-white/90',
        'focus:ring-slate-8 focus:bg-white/90 focus:outline-none focus:ring-2',
      ];
    case 'gradient':
      return [
        'bg-gradient border-[#34343A] backdrop-blur-[1.25rem]',
        'hover:bg-gradientHover',
        'focus:bg-gradientHover focus:outline-none focus:ring-2 focus:ring-white/20',
      ];
    default:
      unreachable(appearance);
  }
};

const getSize = (size: Size) => {
  switch (size) {
    case '1':
      return '';
    case '2':
      return 'h-8 gap-2 rounded-md px-3 text-[.875rem] transition-colors';
    case '3':
      return 'h-10 gap-2 rounded-md px-4 text-[.875rem] transition-colors';
    case '4':
      return 'h-11 gap-2 rounded-md px-4 text-base transition-colors';
    default:
      unreachable(size);
  }
};
