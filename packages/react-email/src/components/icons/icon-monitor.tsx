import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconMonitor = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M9.75 15.25H17.25C18.3546 15.25 19.25 14.3546 19.25 13.25V6.75C19.25 5.64543 18.3546 4.75 17.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V13.25C4.75 14.3546 5.64543 15.25 6.75 15.25H9.75ZM9.75 15.25C9.75 15.25 10 18.25 8 19.25H16C14 18.25 14.25 15.25 14.25 15.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </IconBase>
  ),
);

IconMonitor.displayName = 'IconMonitor';
