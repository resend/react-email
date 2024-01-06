import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconArrowDown = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path d="M12 15L8.5359 9.75L15.4641 9.75L12 15Z" fill="currentColor" />
    </IconBase>
  ),
);

IconArrowDown.displayName = 'IconArrowDown';
