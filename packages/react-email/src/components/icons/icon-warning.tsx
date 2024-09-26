import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconWarning = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        d="M13 17a.999.999 0 1 0-1.998 0a.999.999 0 0 0 1.997 0m-.26-7.853a.75.75 0 0 0-1.493.103l.004 4.501l.007.102a.75.75 0 0 0 1.493-.103l-.004-4.502zm1.23-5.488c-.857-1.548-3.082-1.548-3.938 0L2.286 17.66c-.83 1.5.255 3.34 1.97 3.34h15.49c1.714 0 2.799-1.84 1.969-3.34zm-2.626.726a.75.75 0 0 1 1.313 0l7.746 14.002a.75.75 0 0 1-.657 1.113H4.256a.75.75 0 0 1-.657-1.113z"
        fill="currentColor"
      />
    </IconBase>
  ),
);

IconWarning.displayName = 'IconWarning';
