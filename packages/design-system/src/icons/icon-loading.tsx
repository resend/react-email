import * as React from 'react';
import classnames from 'classnames';
import { IconBase, IconElement, IconProps } from './icon-base';

export const IconLoading = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ className, ...props }, forwardedRef) => (
    <IconBase
      ref={forwardedRef}
      className={classnames('animate-spin', className)}
      {...props}
    >
      <path
        className="opacity-[15%]"
        d="M5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="150,200"
        strokeDashoffset="-16"
      />
    </IconBase>
  ),
);

IconLoading.displayName = 'IconLoading';
