import motion from 'framer-motion/client';
import { Tooltip } from '../tooltip';
import { cn } from '../../utils';

interface ToolbarButtonProps extends React.ComponentProps<'button'> {
  children: React.ReactNode;
  active?: boolean;
  tooltip?: React.ReactNode;
}

export const ToolbarButton = ({
  children,
  className,
  active,
  tooltip,
  ...props
}: ToolbarButtonProps) => {
  return (
    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            {...props}
            className={cn(
              'h-full w-fit font-medium flex text-sm text-slate-10 items-center align-middle justify-center px-1 py-2 gap-1 relative',
              'hover:text-slate-12 transition-colors',
              active && 'data-[state=active]:text-cyan-11',
              className,
            )}
          >
            {children}
            {active ? (
              <motion.span
                className="-bottom-px absolute rounded-sm left-0 w-full bg-cyan-11 h-px"
                layoutId="active-toolbar-button"
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.6,
                }}
              />
            ) : null}
          </button>
        </Tooltip.Trigger>
        {tooltip ? <Tooltip.Content>{tooltip}</Tooltip.Content> : null}
      </Tooltip>
    </Tooltip.Provider>
  );
};
