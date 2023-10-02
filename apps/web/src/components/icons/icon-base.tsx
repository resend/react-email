import * as React from "react";

export interface IconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number;
}

export const IconBase: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  />
);
