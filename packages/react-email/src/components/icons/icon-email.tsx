import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconEmail = React.forwardRef<IconElement, Readonly<IconProps>>(
  (props, forwardedRef) => {
    return (
      <IconBase {...props} ref={forwardedRef}>
        <path
          d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4.7l-8 5.334L4 8.7V6.297l8 5.333l8-5.333z"
          fill="currentColor"
        />
      </IconBase>
    );
  },
);

IconEmail.displayName = 'IconEmail';
