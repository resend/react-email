import { forwardRef } from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconLoader = forwardRef<IconElement, IconProps>((props, ref) => (
  <IconBase
    {...props}
    ref={ref}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </IconBase>
));

IconLoader.displayName = 'IconLoader';
