import * as React from 'react';
import { IconBase, IconElement, IconProps } from './icon-base';

export const IconDownload = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M4.75 14.75v1.5a3 3 0 0 0 3 3h8.5a3 3 0 0 0 3-3v-1.5M12 14.25v-9.5M8.75 10.75l3.25 3.5 3.25-3.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  ),
);

IconDownload.displayName = 'IconDownload';
