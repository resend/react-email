import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import classnames from 'classnames';
import * as React from 'react';

type ContentElement = React.ElementRef<typeof TooltipPrimitive.Content>;
type ContentProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;

export interface TooltipProps extends ContentProps {}

export const TooltipContent = React.forwardRef<ContentElement, Readonly<TooltipProps>>(
  ({ sideOffset = 6, children, ...props }, forwardedRef) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        {...props}
        ref={forwardedRef}
        className={classnames(
          'bg-dark-bg border border-dark-bg-border z-20 px-3 py-2 rounded-md text-xs'
        )}
        sideOffset={sideOffset}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
);

TooltipContent.displayName = 'TooltipContent';
