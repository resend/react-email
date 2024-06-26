import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconSource = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M17.4 15L21 11.5L17.4 8M6.6 8L3 11.5L6.6 15M14.25 4.5L9.75 18.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </IconBase>
  ),
);

IconSource.displayName = 'IconSource';
