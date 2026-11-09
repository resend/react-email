import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconPanelRight = React.forwardRef<
  IconElement,
  Readonly<IconProps>
>(({ ...props }, forwardedRef) => (
  <IconBase ref={forwardedRef} {...props}>
    <path
      clipRule="evenodd"
      d="M5 2.25H19C20.5188 2.25 21.75 3.48122 21.75 5V19C21.75 20.5188 20.5188 21.75 19 21.75L5 21.75C3.48122 21.75 2.25 20.5188 2.25 19L2.25 5C2.25 3.48122 3.48122 2.25 5 2.25ZM5 20.25C4.30964 20.25 3.75 19.6904 3.75 19L3.75 5C3.75 4.30964 4.30964 3.75 5 3.75L14.25 3.75L14.25 20.25L5 20.25ZM15.75 20.25L15.75 3.75L19 3.75C19.6904 3.75 20.25 4.30965 20.25 5L20.25 19C20.25 19.6904 19.6904 20.25 19 20.25H15.75Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </IconBase>
));

IconPanelRight.displayName = 'IconPanelRight';
