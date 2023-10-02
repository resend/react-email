import * as React from "react";
import type { IconProps } from "./icon-base";
import { IconBase } from "./icon-base";

export const IconArrowRight: React.FC<Readonly<IconProps>> = (props) => (
  <IconBase {...props}>
    <path
      d="M13.75 6.75L19.25 12L13.75 17.25"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M19 12H4.75"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </IconBase>
);
