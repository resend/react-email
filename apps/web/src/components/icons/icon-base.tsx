import * as React from 'react';

export type IconElement = SVGSVGElement;
export interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number;
}

export const IconBase = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ size = 20, ...props }, forwardedRef) => (
    <svg
      fill="none"
      height={size}
      ref={forwardedRef}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    />
  ),
);

IconBase.displayName = 'IconBase';
