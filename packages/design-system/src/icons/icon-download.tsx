import * as React from 'react';
import { IconBase, IconElement, IconProps } from './icon-base';

export const IconDownload = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props} width={18} height={18}>
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
      />
    </IconBase>
  ),
);

IconDownload.displayName = 'IconDownload';
