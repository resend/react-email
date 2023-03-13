import classNames from 'classnames';
import * as React from 'react';
import { unreachable } from '../../utils';

type AnchorElement = React.ElementRef<'a'>;
type RootProps = React.ComponentPropsWithoutRef<'a'>;

type Appearance = 'cyan' | 'white';

interface AnchorProps extends RootProps {
  appearance?: Appearance;
}

export const Anchor = React.forwardRef<
  HTMLAnchorElement,
  Readonly<AnchorProps>
>(({ appearance = 'cyan', className, ...props }, forwardedRef) => (
  <a
    ref={forwardedRef}
    className={classNames(
      'rounded-sm outline-none transition-transform duration-200 ease-in-out',
      'hover:-translate-y-1',
      'focus:ring-2 focus:ring-white/20 focus:ring-offset-4 focus:ring-offset-black',
      getAppearance(appearance),
      className,
    )}
    {...props}
  />
));

const getAppearance = (appearance: Appearance | undefined) => {
  switch (appearance) {
    case undefined:
    case 'cyan':
      return ['hover:bg-white/90'];
    case 'white':
      return ['text-slate-12'];
    default:
      unreachable(appearance);
  }
};

Anchor.displayName = 'Anchor';
