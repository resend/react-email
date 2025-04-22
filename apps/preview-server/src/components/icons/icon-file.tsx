import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconFile = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        clipRule="evenodd"
        d="M7.75 4C6.23122 4 5 5.23122 5 6.75V17.25C5 18.7688 6.23122 20 7.75 20H16.25C17.7688 20 19 18.7688 19 17.25V9C19 8.80109 18.921 8.61032 18.7803 8.46967L14.5303 4.21967C14.3897 4.07902 14.1989 4 14 4H7.75ZM6.5 6.75C6.5 6.05964 7.05964 5.5 7.75 5.5H13V9.25C13 9.66421 13.3358 10 13.75 10H17.5V17.25C17.5 17.9404 16.9404 18.5 16.25 18.5H7.75C7.05964 18.5 6.5 17.9404 6.5 17.25V6.75ZM16.6893 8.5L14.5 6.31066V8.5H16.6893Z"
        fill="currentColor"
        fillOpacity="0.927"
        fillRule="evenodd"
      />
    </IconBase>
  ),
);

IconFile.displayName = 'IconFile';
