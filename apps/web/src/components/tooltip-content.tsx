import * as TooltipPrimitive from '@radix-ui/react-tooltip';

type ContentElement = React.ComponentRef<typeof TooltipPrimitive.Content>;
type ContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
  'sideOffset'
> & {
  sideOffset?: number;
  ref?: React.RefObject<ContentElement>;
};

export type TooltipProps = ContentProps;

export function TooltipContent({
  sideOffset = 6,
  children,
  ref,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        {...props}
        className="z-20 rounded-md border border-slate-6 bg-black px-3 py-2 text-white text-xs"
        ref={ref}
        sideOffset={sideOffset}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
