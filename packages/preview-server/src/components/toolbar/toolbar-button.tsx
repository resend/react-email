import { motion } from 'framer-motion';
import { cn } from '../../utils';
import { Tooltip } from '../tooltip';

interface ToolbarButtonProps extends React.ComponentProps<'button'> {
  children: React.ReactNode;
  active?: boolean;
  tooltip?: React.ReactNode;
  delayDuration?: number;
}

export const ToolbarButton = ({
  children,
  className,
  active,
  tooltip,
  delayDuration = 500,
  ...props
}: ToolbarButtonProps) => {
  return (
    <Tooltip.Provider>
      <Tooltip delayDuration={delayDuration}>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            {...props}
            className={cn(
              'h-full w-fit font-regular flex text-sm text-slate-10 items-center align-middle justify-center px-1 gap-2 relative',
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
