'use client';
import * as SlotPrimitive from '@radix-ui/react-slot';
import type * as React from 'react';
import animatedLoadIcon from '../animated-icons-data/load.json';
import { cn } from '../utils/cn';
import { unreachable } from '../utils/unreachable';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type RootProps = React.ComponentProps<'button'>;

type Appearance = 'white' | 'gradient';
type Size = '1' | '2' | '3' | '4';

interface ButtonProps extends RootProps {
  asChild?: boolean;
  appearance?: Appearance;
  size?: Size;
  loading?: boolean;
}

export const Button = ({
  asChild,
  appearance = 'white',
  className,
  children,
  size = '2',
  loading,
  ref,
  ...props
}: ButtonProps) => {
  const Root = asChild ? SlotPrimitive.Slot : 'button';

  return (
    <Root
      ref={ref}
      type="button"
      {...props}
      className={cn(
        getSize(size),
        getAppearance(appearance),
        'inline-flex items-center justify-center gap-2 border font-medium',
        className,
      )}
      aria-disabled={loading}
    >
      <span
        className={cn(
          '-ml-7 opacity-0 transition-opacity duration-200',
          loading && 'opacity-100',
        )}
      >
        <DotLottieReact
          data={animatedLoadIcon}
          autoplay={false}
          className="h-5 w-5"
          loop={true}
        />
      </span>
      <SlotPrimitive.Slottable>{children}</SlotPrimitive.Slottable>
    </Root>
  );
};

Button.displayName = 'Button';

const getAppearance = (appearance: Appearance | undefined) => {
  switch (appearance) {
    case undefined:
    case 'white':
      return [
        'border-white bg-white text-black transition-colors duration-200 ease-in-out',
        'hover:bg-white/90',
        'focus:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20',
        'mt-2 mb-4 aria-disabled:border-transparent aria-disabled:bg-slate-11',
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
