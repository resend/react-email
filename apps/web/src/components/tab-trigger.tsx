import * as Tabs from '@radix-ui/react-tabs';
import classNames from 'classnames';
import { motion } from 'framer-motion';

interface TabTriggerProps {
  value: string;
  activeView: string;
  layoutId: string;
  children: React.ReactNode;
  ref?: React.RefObject<HTMLButtonElement>;
  className?: string;
}

export function TabTrigger({
  value,
  activeView,
  children,
  ref,
  layoutId,
  className,
}: TabTriggerProps) {
  return (
    <Tabs.Trigger
      className={classNames(
        'relative scroll-m-2 rounded-md px-3 py-1.5',
        className,
        {
          'text-slate-11': activeView !== value,
          'text-slate-12': activeView === value,
        },
      )}
      ref={ref}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      tabIndex={0}
      value={value}
    >
      {activeView === value && (
        <motion.span
          className="pointer-events-none absolute inset-0 z-[2] rounded-lg bg-slate-6 group-focus:outline-none"
          initial={false}
          layoutId={layoutId}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.3,
          }}
        />
      )}
      {children}
    </Tabs.Trigger>
  );
}
