import * as React from 'react';

export type IconElement = React.ElementRef<'svg'>;
export type RootProps = React.ComponentPropsWithRef<'svg'>;

export interface IconProps extends RootProps {
  size?: number;
}

export const IconBase = ({ ref, size = 20, ...props }: IconProps) => (
  <svg
    fill="none"
    height={size}
    ref={ref}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  />
);

IconBase.displayName = 'IconBase';
