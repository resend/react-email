import * as React from 'react';

export type IconElement = React.ElementRef<'svg'>;
export type RootProps = React.ComponentPropsWithoutRef<'svg'>;

export interface IconProps extends RootProps {
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
