import { Root } from '@radix-ui/react-tooltip';
import * as React from 'react';
import { TooltipArrow } from './tooltip-arrow';
import { TooltipContent } from './tooltip-content';
import { TooltipProvider } from './tooltip-provider';
import { TooltipTrigger } from './tooltip-trigger';

type RootProps = React.ComponentPropsWithoutRef<typeof Root>;

export interface TooltipProps extends RootProps {}

export const TooltipRoot: React.FC<Readonly<TooltipProps>> = ({
  children,
  ...props
}) => <Root {...props}>{children}</Root>;

export const Tooltip = Object.assign(TooltipRoot, {
  Arrow: TooltipArrow,
  Provider: TooltipProvider,
  Content: TooltipContent,
  Trigger: TooltipTrigger,
});
