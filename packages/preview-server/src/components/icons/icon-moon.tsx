import * as React from 'react';
import type { IconElement, IconProps } from './icon-base';
import { IconBase } from './icon-base';

export const IconMoon = React.forwardRef<IconElement, Readonly<IconProps>>(
  ({ ...props }, forwardedRef) => (
    <IconBase ref={forwardedRef} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12.226 2.003a9.97 9.97 0 0 0-7.297 2.926c-3.905 3.905-3.905 10.237 0 14.142s10.237 3.905 14.142 0a9.97 9.97 0 0 0 2.926-7.297a10 10 0 0 0-.337-2.368a15 15 0 0 1-1.744 1.436c-1.351.949-2.733 1.563-3.986 1.842c-1.906.423-3.214.032-3.93-.684s-1.107-2.024-.684-3.93c.279-1.253.893-2.635 1.842-3.986c.414-.592.893-1.177 1.436-1.744a10 10 0 0 0-2.368-.337m5.43 15.654a7.96 7.96 0 0 0 2.251-4.438c-3.546 2.045-7.269 2.247-9.321.195s-1.85-5.775.195-9.321a8 8 0 1 0 6.876 13.564"
        clipRule="evenodd"
      />
    </IconBase>
  ),
);

IconMoon.displayName = 'IconMoon';
