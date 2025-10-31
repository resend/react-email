import { Slot } from '@radix-ui/react-slot';
import classNames from 'classnames';
import { unreachable } from '../utils/unreachable';

type Appearance = 'white' | 'gradient';
type Size = '1' | '2' | '3' | '4' | '5';

interface ButtonProps extends React.ComponentProps<'button'> {
  asChild?: boolean;
  appearance?: Appearance;
  size?: Size;
}

export function Button({
  asChild,
  appearance = 'white',
  className,
  children,
  size = '2',
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={classNames(
        getSize(size),
        getAppearance(appearance),
        'inline-flex items-center justify-center border font-medium',
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </Comp>
  );
}

const getAppearance = (appearance: Appearance) => {
  switch (appearance) {
    case 'white':
      return [
        'bg-white text-black',
        'hover:bg-white/90',
        'focus-visible:ring-slate-10 focus-visible:bg-white/90 focus-visible:outline-none focus-visible:ring-2',
        'selection:text-black',
      ];
    case 'gradient':
      return [
        'bg-gradient border-[#34343A] backdrop-blur-[1.25rem]',
        'hover:bg-gradientHover',
        'focus-visible:bg-gradientHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20',
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
      return 'h-8 gap-2 rounded-xl px-3 text-[.875rem] transition-colors';
    case '3':
      return 'h-10 gap-2 rounded-xl px-4 text-[.875rem] transition-colors';
    case '4':
      return 'h-11 gap-2 rounded-xl px-4 text-base transition-colors';
    case '5':
      return 'h-12 gap-2 rounded-xl px-4 text-base transition-colors';
    default:
      unreachable(size);
  }
};
