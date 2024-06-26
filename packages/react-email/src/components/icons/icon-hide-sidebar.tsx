import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconHideSidebar = React.forwardRef<
  IconElement,
  Readonly<IconProps>
>(({ ...props }, forwardedRef) => (
  <IconBase ref={forwardedRef} {...props}>
    <path
      d="M15.4697 15.5303C15.7626 15.8232 16.2374 15.8232 16.5303 15.5303C16.8232 15.2374 16.8232 14.7626 16.5303 14.4697L14.0607 12L16.5303 9.53033C16.8232 9.23744 16.8232 8.76256 16.5303 8.46967C16.2374 8.17678 15.7626 8.17678 15.4697 8.46967L12.4697 11.4697C12.1768 11.7626 12.1768 12.2374 12.4697 12.5303L15.4697 15.5303Z"
      fill="currentColor"
    />
    <path
      clipRule="evenodd"
      d="M19 2.25H5C3.48122 2.25 2.25 3.48122 2.25 5V19C2.25 20.5188 3.48122 21.75 5 21.75L19 21.75C20.5188 21.75 21.75 20.5188 21.75 19L21.75 5C21.75 3.48122 20.5188 2.25 19 2.25ZM19 20.25C19.6904 20.25 20.25 19.6904 20.25 19L20.25 5C20.25 4.30964 19.6904 3.75 19 3.75L9.75 3.75L9.75 20.25L19 20.25ZM8.25 20.25L8.25 3.75L5 3.75C4.30965 3.75 3.75 4.30965 3.75 5L3.75 19C3.75 19.6904 4.30965 20.25 5 20.25H8.25Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </IconBase>
));

IconHideSidebar.displayName = 'IconHideSidebar';
