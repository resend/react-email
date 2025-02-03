import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { motion } from 'framer-motion';
import { cn } from '../../utils';
import { tabTransition } from '../../utils/constants';
import { IconMonitor } from '../icons/icon-monitor';
import { IconSource } from '../icons/icon-source';
import { Tooltip } from '../tooltip';

interface ActiveViewToggleGroupProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const ActiveViewToggleGroup = ({
  activeView,
  setActiveView,
}: ActiveViewToggleGroupProps) => {
  return (
    <ToggleGroup.Root
      aria-label="View mode"
      className="inline-block items-center bg-slate-2 border border-slate-6 rounded-md overflow-hidden h-[36px]"
      onValueChange={(value) => {
        if (value) setActiveView(value);
      }}
      type="single"
      value={activeView}
    >
      <ToggleGroup.Item value="preview">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <div
              className={cn(
                'px-3 py-2 transition ease-in-out duration-200 relative hover:text-slate-12',
                {
                  'text-slate-11': activeView !== 'desktop',
                  'text-slate-12': activeView === 'desktop',
                },
              )}
            >
              {activeView === 'preview' && (
                <motion.span
                  animate={{ opacity: 1 }}
                  className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  layoutId="topbar-tabs"
                  transition={tabTransition}
                />
              )}
              <IconMonitor />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>Preview</Tooltip.Content>
        </Tooltip>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="source">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <div
              className={cn(
                'px-3 py-2 transition ease-in-out duration-200 relative hover:text-slate-12',
                {
                  'text-slate-11': activeView !== 'source',
                  'text-slate-12': activeView === 'source',
                },
              )}
            >
              {activeView === 'source' && (
                <motion.span
                  animate={{ opacity: 1 }}
                  className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  layoutId="topbar-tabs"
                  transition={tabTransition}
                />
              )}
              <IconSource />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>Code</Tooltip.Content>
        </Tooltip>
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
