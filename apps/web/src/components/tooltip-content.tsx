import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import classNames from "classnames";
import { inter } from "../app/inter";

type ContentElement = React.ElementRef<typeof TooltipPrimitive.Content>;
type ContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
  "sideOffset"
> & {
  sideOffset?: number;
};

export type TooltipProps = ContentProps;

export const TooltipContent = React.forwardRef<
  ContentElement,
  Readonly<TooltipProps>
>(({ sideOffset = 6, children, ...props }, forwardedRef) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      {...props}
      className={classNames(
        "z-20 rounded-md border border-slate-6 bg-black px-3 py-2 text-xs text-white",
        `${inter.variable} font-sans`,
      )}
      ref={forwardedRef}
      sideOffset={sideOffset}
    >
      {children}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = "TooltipContent";
