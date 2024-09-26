import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconExternalLink = React.forwardRef<
  IconElement,
  Readonly<IconProps>
>(({ ...props }, forwardedRef) => (
  <IconBase ref={forwardedRef} {...props}>
    <path
      d="M12 6H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-5m-6 0l7.5-7.5M15 3h6v6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </IconBase>
));

IconExternalLink.displayName = 'IconExternalLink';
