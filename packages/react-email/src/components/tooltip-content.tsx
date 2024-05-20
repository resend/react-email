import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
import { cn } from '../utils';
import { inter } from '../app/inter';

type ContentProps = React.ComponentPropsWithRef<
  typeof TooltipPrimitive.Content
>;

export type TooltipProps = ContentProps;

export const TooltipContent = ({
  sideOffset = 6,
  children,
  ref,
  ...props
}: TooltipProps) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      {...props}
      className={cn(
        'bg-black border border-slate-6 z-20 px-3 py-2 rounded-md text-xs',
        `${inter.variable} font-sans`,
      )}
      ref={ref}
      sideOffset={sideOffset}
    >
      {children}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
);

TooltipContent.displayName = 'TooltipContent';
