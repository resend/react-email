import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconArrowUpRight = React.forwardRef<
  IconElement,
  Readonly<IconProps>
>(({ ...props }, forwardedRef) => (
  <IconBase ref={forwardedRef} {...props}>
    <path
      d="M7 17L17 7M17 7H8M17 7V16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </IconBase>
));

IconArrowUpRight.displayName = 'IconArrowUpRight';
