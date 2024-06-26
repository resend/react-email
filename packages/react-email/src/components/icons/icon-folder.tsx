import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconFolder = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        clipRule="evenodd"
        d="M6.75 4C5.23122 4 4 5.23122 4 6.75V7.75V8V17.25C4 18.7688 5.23122 20 6.75 20H17.25C18.7688 20 20 18.7688 20 17.25V9.75C20 8.23122 18.7688 7 17.25 7H14.0816L13.227 5.43322C12.7451 4.54965 11.819 4 10.8127 4H6.75ZM12.3729 7L11.9101 6.15145L11.91 6.15138C11.6911 5.74989 11.2702 5.5 10.8127 5.5H6.75C6.05964 5.5 5.5 6.05964 5.5 6.75V7H12.3729ZM5.5 17.25V8.5H17.25C17.9404 8.5 18.5 9.05964 18.5 9.75V17.25C18.5 17.9404 17.9404 18.5 17.25 18.5H6.75C6.05964 18.5 5.5 17.9404 5.5 17.25Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </IconBase>
  ),
);

IconFolder.displayName = 'IconFolder';
