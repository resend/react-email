import { Arrow, Content, Portal } from '@radix-ui/react-tooltip';
import * as React from 'react';

type ContentElement = React.ElementRef<typeof Content>;
type ContentProps = React.ComponentPropsWithoutRef<typeof Content>;

export interface TooltipProps extends ContentProps {}

export const TooltipContent = React.forwardRef<
  ContentElement,
  Readonly<TooltipProps>
>(({ className, sideOffset = 6, children, ...props }, forwardedRef) => (
  <Portal>
    <Content
      {...props}
      ref={forwardedRef}
      className="bg-gray-2 border border-gray-7 z-20 px-2 py-1 rounded-md text-sm radix-side-top:animate-slide-down-fade radix-side-right:animate-slide-left-fade radix-side-bottom:animate-slide-up-fade radix-side-left:animate-slide-right-fade"
      sideOffset={sideOffset}
    >
      {children}
      <Arrow fill="#1c1c1f" />
    </Content>
  </Portal>
));

TooltipContent.displayName = 'TooltipContent';
