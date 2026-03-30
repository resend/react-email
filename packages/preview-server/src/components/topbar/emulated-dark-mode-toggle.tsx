import * as Toggle from '@radix-ui/react-toggle';
import { cn } from '../../utils';
import { IconMoon } from '../icons/icon-moon';
import { IconSun } from '../icons/icon-sun';
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
            'text-slate-11 hover:text-slate-12 aria-pressed:bg-slate-4',
          )}
          pressed={enabled}
          onPressedChange={() => onChange(!enabled)}
        >
          <div className="relative w-5 h-5">
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out',
                enabled
                  ? 'opacity-0 scale-50 rotate-90'
                  : 'opacity-100 scale-100 rotate-0',
              )}
            >
              <IconMoon />
            </div>
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out',
                enabled
                  ? 'opacity-100 scale-100 rotate-0'
                  : 'opacity-0 scale-50 -rotate-90',
              )}
            >
              <IconSun />
            </div>
          </div>
        </Toggle.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>
        When enabled, inverts colors in the preview emulating what email clients
        do in dark mode.
      </Tooltip.Content>
    </Tooltip>
  );
};
