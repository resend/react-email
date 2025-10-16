import { forwardRef } from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconImage = forwardRef<IconElement, IconProps>((props, ref) => (
  <IconBase {...props} ref={ref}>
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </g>
  </IconBase>
));
