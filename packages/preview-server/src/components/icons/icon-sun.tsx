import type { IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconSun = ({ ...props }: IconProps) => (
  <IconBase {...props}>
    <circle
      cx="12"
      cy="12"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 2v2"
    />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20v2"
    />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.93 4.93 1.41 1.41"
    />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m17.66 17.66 1.41 1.41"
    />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2 12h2"
    />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 12h2"
    />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m6.34 17.66-1.41 1.41"
    />
    <path
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.07 4.93-1.41 1.41"
    />
  </IconBase>
);

IconSun.displayName = 'IconSun';
