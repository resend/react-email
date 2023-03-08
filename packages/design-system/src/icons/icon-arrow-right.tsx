import * as React from 'react';
import { IconBase, IconElement, IconProps } from './icon-base';

export const IconArrowRight = React.forwardRef<
  IconElement,
  Readonly<IconProps>
>(({ ...props }, forwardedRef) => (
  <IconBase ref={forwardedRef} {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M13.75 6.75L19.25 12L13.75 17.25"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M19 12H4.75"
    />
  </IconBase>
));

IconArrowRight.displayName = 'IconArrowRight';
