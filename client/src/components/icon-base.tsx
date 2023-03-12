import * as React from 'react';

export interface IconProps {
  size?: number;
}

export type IconElement = React.ElementRef<'svg'>;
export type RootProps = React.ComponentPropsWithoutRef<'svg'>;

export interface IconProps extends RootProps {}

export const IconBase = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ size = 20, ...props }, forwardedRef) => (
    <svg
      ref={forwardedRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    />
  ),
);

IconBase.displayName = 'IconBase';
