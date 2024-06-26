import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconArrowDown = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M12 16L6 9.85966L6.84 9L12 14.2808L17.16 9L18 9.85966L12 16Z"
        fill="currentColor"
      />
    </IconBase>
  ),
);

IconArrowDown.displayName = 'IconArrowDown';
