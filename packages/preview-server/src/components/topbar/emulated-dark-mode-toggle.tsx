import * as Toggle from '@radix-ui/react-toggle';
import { cn } from '../../utils';
import { IconMoon } from '../icons/icon-moon';
import { Tooltip } from '../tooltip';

interface EmulatedDarkModeToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => unknown;
}

export const EmulatedDarkModeToggle = ({
  enabled,
  onChange,
}: EmulatedDarkModeToggleProps) => {
  return (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Toggle.Root
          value="dark"
          className={cn(
            'relative w-9 h-9 flex items-center justify-center border border-slate-6 text-sm rounded-lg transition duration-200 ease-in-out',
            'text-slate-11 hover:text-slate-12 aria-pressed:text-slate-12 aria-pressed:bg-slate-4',
          )}
          pressed={enabled}
          onPressedChange={() => onChange(!enabled)}
        >
          <IconMoon />
        </Toggle.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>
        When enabled, inverts colors in the preview emulating what email clients
        do in dark mode.
      </Tooltip.Content>
    </Tooltip>
  );
};
