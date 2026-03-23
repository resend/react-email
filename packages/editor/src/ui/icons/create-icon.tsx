import type * as React from 'react';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;
}

export function createIcon(
  name: string,
  children: React.ReactNode,
): React.FC<IconProps> {
  function Icon({ size = 24, width, height, ...props }: IconProps) {
    return (
      <svg
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
        {children}
      </svg>
    );
  }
  Icon.displayName = name;
  return Icon;
}
