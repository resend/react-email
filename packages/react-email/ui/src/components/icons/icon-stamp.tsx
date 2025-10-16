import { forwardRef } from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconStamp = forwardRef<IconElement, IconProps>((props, ref) => (
  <IconBase {...props} ref={ref}>
    <path
      d="M9.122 4.388A2.25 2.25 0 0 1 11.368 2h1.31a2.25 2.25 0 0 1 2.247 2.388l-.604 9.862h4.202a2.25 2.25 0 0 1 2.25 2.25v3.25a.75.75 0 0 1-.75.75h-.5v.75a.75.75 0 0 1-.75.75h-13.5a.75.75 0 0 1-.75-.75v-.75h-.5a.75.75 0 0 1-.75-.75V16.5a2.25 2.25 0 0 1 2.25-2.25h4.203zM19.273 19v-2.5a.75.75 0 0 0-.75-.75h-13a.75.75 0 0 0-.75.75V19zM13.427 4.296a.75.75 0 0 0-.748-.796h-1.31a.75.75 0 0 0-.75.796l.61 9.954h1.589z"
      fill="currentColor"
    />
  </IconBase>
));

IconStamp.displayName = 'IconStamp';
