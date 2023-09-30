import * as React from "react";

type PipeElement = React.ElementRef<"svg">;
type RootProps = React.ComponentPropsWithoutRef<"svg">;

export const Pipe = React.forwardRef<PipeElement, Readonly<RootProps>>(
  ({ ...props }, forwardedRef) => (
    <svg
      fill="none"
      height="37"
      ref={forwardedRef}
      strokeDasharray="1000"
      strokeDashoffset="1000"
      viewBox="0 0 171 37"
      width="171"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_3_508)">
        <path
          d="M171 1L96.8 1C94.0386 1 91.8 3.23857 91.8 6V31C91.8 33.7614 89.5614 36 86.8 36H0"
          stroke="url(#paint0_linear_3_508)"
          strokeWidth="0.5"
        />
      </g>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_3_508"
          x1="20"
          x2="45.5"
          y1="44"
          y2="-42.5"
        >
          <stop offset="0.021" stopOpacity="0" />
          <stop offset="0.197917" stopColor="#2A6281" stopOpacity="0.5" />
          <stop offset="0.473958" stopColor="#45CBBB" stopOpacity="0.4" />
          <stop offset="0.744792" stopColor="#071A5B" stopOpacity="0.5" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip0_3_508">
          <rect fill="white" height="37" width="171" />
        </clipPath>
      </defs>
    </svg>
  ),
);

Pipe.displayName = "Pipe";
