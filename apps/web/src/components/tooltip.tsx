import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type * as React from 'react';
import { TooltipContent } from './tooltip-content';

export type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>;
export const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.TooltipTrigger;

export { TooltipContent, TooltipTrigger };
