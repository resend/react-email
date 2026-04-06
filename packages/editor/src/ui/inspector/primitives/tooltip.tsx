import type * as React from 'react';

function TooltipRoot({ children, ...rest }: React.ComponentProps<'div'>) {
  return (
    <div data-re-inspector-tooltip="" {...rest}>
      {children}
    </div>
  );
}

function TooltipTrigger({ children, ...rest }: React.ComponentProps<'div'>) {
  return (
    <div data-re-inspector-tooltip-trigger="" {...rest}>
      {children}
    </div>
  );
}

function TooltipContent({ children, ...rest }: React.ComponentProps<'div'>) {
  return (
    <div data-re-inspector-tooltip-content="" {...rest}>
      {children}
    </div>
  );
}

export const Root = TooltipRoot;
export const Trigger = TooltipTrigger;
export const Content = TooltipContent;
