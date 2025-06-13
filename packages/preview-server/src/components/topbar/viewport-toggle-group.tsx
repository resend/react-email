import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { motion } from 'framer-motion';
import { cn } from '../../utils';
import { tabTransition } from '../../utils/constants';
import { Tooltip } from '../tooltip';

interface ViewportToggleGroupProps {
  activeViewport: string;
  setActiveViewport: (viewport: string) => void;
}

export const ViewportToggleGroup = ({
  activeViewport,
  setActiveViewport,
}: ViewportToggleGroupProps) => {
  return (
    <ToggleGroup.Root
      aria-label="Viewport mode"
      className="inline-block items-center bg-slate-2 border border-slate-6 rounded-md overflow-hidden h-[36px]"
      onValueChange={(value) => {
        if (value) setActiveViewport(value);
      }}
      type="single"
      value={activeViewport}
    >
      <ToggleGroup.Item value="desktop">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <div
              className={cn(
                'px-3 py-2 transition ease-in-out duration-200 relative hover:text-slate-12',
                {
                  'text-slate-11': activeViewport !== 'desktop',
                  'text-slate-12': activeViewport === 'desktop',
                },
              )}
            >
              {activeViewport === 'desktop' && (
                <motion.span
                  animate={{ opacity: 1 }}
                  className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  layoutId="viewport-tabs"
                  transition={tabTransition}
                />
              )}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>Desktop</Tooltip.Content>
        </Tooltip>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="mobile">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <div
              className={cn(
                'px-3 py-2 transition ease-in-out duration-200 relative hover:text-slate-12',
                {
                  'text-slate-11': activeViewport !== 'mobile',
                  'text-slate-12': activeViewport === 'mobile',
                },
              )}
            >
              {activeViewport === 'mobile' && (
                <motion.span
                  animate={{ opacity: 1 }}
                  className="absolute left-0 right-0 top-0 bottom-0 bg-slate-4"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  layoutId="viewport-tabs"
                  transition={tabTransition}
                />
              )}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>Mobile</Tooltip.Content>
        </Tooltip>
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
