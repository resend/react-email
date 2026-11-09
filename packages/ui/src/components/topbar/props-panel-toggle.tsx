import * as Toggle from '@radix-ui/react-toggle';
import { cn } from '../../utils';
import { IconPanelRight } from '../icons/icon-panel-right';
import { Tooltip } from '../tooltip';

interface PropsPanelToggleProps {
  open: boolean;
  onChange: (open: boolean) => unknown;
}

export const PropsPanelToggle = ({ open, onChange }: PropsPanelToggleProps) => {
  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Toggle.Root
          aria-label="Props panel"
          className={cn(
            'relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-6 text-sm transition duration-200 ease-in-out',
            'text-slate-11 aria-pressed:bg-slate-4 hover:text-slate-12',
          )}
          onPressedChange={() => onChange(!open)}
          pressed={open}
          value="props"
        >
          <IconPanelRight size={20} />
        </Toggle.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>Show/hide the props panel</Tooltip.Content>
    </Tooltip>
  );
};
