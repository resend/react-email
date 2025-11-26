import type { IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconCloudAlert = (props: IconProps) => (
  <IconBase
    {...props}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 12v4" />
    <path d="M12 20h.01" />
    <path d="M17 18h.5a1 1 0 0 0 0-9h-1.79A7 7 0 1 0 7 17.708" />
  </IconBase>
);

IconCloudAlert.displayName = 'IconCloudAlert';
