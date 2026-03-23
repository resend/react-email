import type { IconProps } from './icon-props';

export function CaseUpperIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 15 4-8 4 8" />
      <path d="M4 13h6" />
      <path d="m15 15 4-8 4 8" />
      <path d="M16 13h6" />
    </svg>
  );
}
