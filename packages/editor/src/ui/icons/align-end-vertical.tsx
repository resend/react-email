import type { IconProps } from './types';

export function AlignEndVerticalIcon({
  size,
  width,
  height,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? width ?? 24}
      height={size ?? height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="9" height="6" x="9" y="14" rx="2" />
      <rect width="16" height="6" x="2" y="4" rx="2" />
      <path d="M22 2v20" />
    </svg>
  );
}
