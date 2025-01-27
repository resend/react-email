import * as SlotPrimitive from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from '../utils/cn';
import { unreachable } from '../utils/unreachable';

type ButtonElement = React.ComponentRef<'button'>;
type RootProps = React.ComponentPropsWithoutRef<'button'>;

type Appearance = 'white' | 'gradient';
type Size = '1' | '2' | '3' | '4';

interface ButtonProps extends RootProps {
  asChild?: boolean;
  appearance?: Appearance;
  size?: Size;
}

export const Button = React.forwardRef<ButtonElement, Readonly<ButtonProps>>(
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
    const classNames = cn(
      getSize(size),
      getAppearance(appearance),
      'inline-flex items-center justify-center border font-medium',
      className,
    );

    return asChild ? (
      <SlotPrimitive.Slot ref={forwardedRef} {...props} className={classNames}>
        <SlotPrimitive.Slottable>{children}</SlotPrimitive.Slottable>
      </SlotPrimitive.Slot>
    ) : (
      <button
        className={classNames}
        ref={forwardedRef}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

const getAppearance = (appearance: Appearance | undefined) => {
  switch (appearance) {
    case undefined:
    case 'white':
      return [
        'border-white bg-white text-black transition-colors duration-200 ease-in-out',
        'hover:bg-white/90',
        'focus:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20',
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

const getSize = (size: Size | undefined) => {
  switch (size) {
    case '1':
      return '';
    case undefined:
    case '2':
      return 'text-[.875rem] h-8 px-3 rounded-md gap-2';
    case '3':
      return 'text-[.875rem] h-10 px-4 rounded-md gap-2';
    case '4':
      return 'text-base h-11 px-4 rounded-md gap-2';
    default:
      unreachable(size);
  }
};
