import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { motion } from 'framer-motion';
import { useId } from 'react';
import { cn } from '../../utils';
import { tabTransition } from '../../utils/constants';
import { IconMoon } from '../icons/icon-moon';
import { IconSun } from '../icons/icon-sun';
import { Tooltip } from '../tooltip';

interface ThemeToggleGroupProps {
  active: 'light' | 'dark';
  onChange: (theme: 'light' | 'dark') => unknown;
}

export const ThemeToggleGroup = ({
  active,
  onChange,
}: ThemeToggleGroupProps) => {
  const id = useId();
  return (
    <ToggleGroup.Root
      aria-label="Color Scheme"
      className="inline-block items-center bg-slate-2 border border-slate-6 rounded-md overflow-hidden h-[36px]"
      id={id}
      onValueChange={(value) => {
        if (value) onChange(value as 'light' | 'dark');
      }}
      type="single"
      value={active}
    >
      <Tooltip>
        <Tooltip.Trigger asChild>
          <ToggleGroup.Item
            value="light"
            aria-label="Enable light mode"
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
          </ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Content>System</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <ToggleGroup.Item
            aria-label="Enable dark mode"
            value="dark"
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
          </ToggleGroup.Item>
        </Tooltip.Trigger>
        <Tooltip.Content>Emulated Dark</Tooltip.Content>
      </Tooltip>
    </ToggleGroup.Root>
  );
};
