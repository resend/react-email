import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Tooltip } from '../tooltip';
import { cn } from '../../utils';
import { motion } from 'framer-motion';
import { IconMoon } from '../icons/icon-moon';
import { tabTransition } from '../../utils/constants';
import { IconSun } from '../icons/icon-sun';

interface ThemeToggleGroupProps {
  active: 'light' | 'dark';
  onChange: (theme: 'light' | 'dark') => unknown;
}

export const ThemeToggleGroup = ({ active, onChange }: ThemeToggleGroupProps) => {
  return (
    <ToggleGroup.Root
      aria-label="Color Scheme"
      className="inline-block items-center bg-slate-2 border border-slate-6 rounded-md overflow-hidden h-[36px]"
      id="theme-toggle"
      onValueChange={(value) => {
        if (value) onChange(value as 'light' | 'dark');
      }}
      type="single"
      value={active}
    >
      <ToggleGroup.Item value="light">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <div
              className={cn(
                'relative px-3 py-2 transition duration-200 ease-in-out hover:text-slate-12',
                {
                  'text-slate-11': active !== 'light',
                  'text-slate-12': active === 'light',
                },
              )}
            >
              {active === 'light' && (
                <motion.span
                  animate={{ opacity: 1 }}
                  className="absolute top-0 right-0 bottom-0 left-0 bg-slate-4"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  layoutId="topbar-theme-tabs"
                  transition={tabTransition}
                />
              )}
              <IconSun />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>Light</Tooltip.Content>
        </Tooltip>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="dark">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <div
              className={cn(
                'relative px-3 py-2 transition duration-200 ease-in-out hover:text-slate-12',
                {
                  'text-slate-11': active !== 'dark',
                  'text-slate-12': active === 'dark',
                },
              )}
            >
              {active === 'dark' && (
                <motion.span
                  animate={{ opacity: 1 }}
                  className="absolute top-0 right-0 bottom-0 left-0 bg-slate-4"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  layoutId="topbar-theme-tabs"
                  transition={tabTransition}
                />
              )}
              <IconMoon />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content>Dark</Tooltip.Content>
        </Tooltip>
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
};
