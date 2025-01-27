import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
import { inter } from '../app/inter';
import { cn } from '../utils';

type ContentElement = React.ComponentRef<typeof TooltipPrimitive.Content>;
type ContentProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
>;

export type TooltipProps = ContentProps;

export const TooltipContent = React.forwardRef<
  ContentElement,
  Readonly<TooltipProps>
>(({ sideOffset = 6, children, ...props }, forwardedRef) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      {...props}
      className={cn(
        'z-20 rounded-md border border-slate-6 bg-black px-3 py-2 text-white text-xs',
        `${inter.variable} font-sans`,
      )}
      ref={forwardedRef}
      sideOffset={sideOffset}
    >
      {children}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = 'TooltipContent';
