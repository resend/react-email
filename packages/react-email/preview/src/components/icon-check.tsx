import * as React from 'react';
import { IconBase, IconElement, IconProps } from './icon-base';

export const IconCheck = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M16.25 8.75L10.406 15.25L7.75 12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  ),
);

IconCheck.displayName = 'IconCheck';
