import type * as React from 'react';

function TooltipRoot({ children, ...rest }: React.ComponentProps<'span'>) {
  return (
    <span data-re-inspector-tooltip="" {...rest}>
      {children}
    </span>
  );
}

function TooltipTrigger({ children, ...rest }: React.ComponentProps<'span'>) {
  return (
    <span data-re-inspector-tooltip-trigger="" {...rest}>
      {children}
    </span>
  );
}

function TooltipContent({ children, ...rest }: React.ComponentProps<'span'>) {
  return (
    <span data-re-inspector-tooltip-content="" {...rest}>
      {children}
    </span>
  );
}

export const Root = TooltipRoot;
export const Trigger = TooltipTrigger;
export const Content = TooltipContent;
