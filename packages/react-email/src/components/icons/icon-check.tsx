import * as React from 'react';
import type { IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconCheck = ({ ref, ...props }: IconProps) => (
  <IconBase ref={ref} {...props}>
    <path
      d="M16.25 8.75L10.406 15.25L7.75 12.75"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </IconBase>
);

IconCheck.displayName = 'IconCheck';
