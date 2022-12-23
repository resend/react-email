import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';
import { TooltipContent } from './tooltip-content';

type RootProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>;

export interface TooltipProps extends RootProps {}

export const TooltipRoot: React.FC<Readonly<TooltipProps>> = ({
  children,
  ...props
}) => <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;

export const Tooltip = Object.assign(TooltipRoot, {
  Arrow: TooltipPrimitive.TooltipArrow,
  Provider: TooltipPrimitive.TooltipProvider,
  Content: TooltipContent,
  Trigger: TooltipPrimitive.TooltipTrigger,
});
