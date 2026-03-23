import * as React from 'react';
import type { IconProps } from './types';

export const AlignLeftIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, width, height, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 12H3" />
      <path d="M17 18H3" />
      <path d="M21 6H3" />
    </svg>
  ),
);
AlignLeftIcon.displayName = 'AlignLeftIcon';
