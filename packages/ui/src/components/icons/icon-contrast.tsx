import type { IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconContrast = ({ ...props }: IconProps) => (
  <IconBase {...props}>
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path fill="currentColor" d="M12 3a9 9 0 0 1 0 18z" />
  </IconBase>
);

IconContrast.displayName = 'IconContrast';
