import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { cn } from '../../utils';
import type { DarkModePreview } from '../../utils/dark-mode-preview';
import { IconContrast } from '../icons/icon-contrast';
import { IconMoon } from '../icons/icon-moon';
import { Tooltip } from '../tooltip';

interface DarkModeToggleGroupProps {
  mode: DarkModePreview;
  onChange: (mode: DarkModePreview) => unknown;
}

// Email clients are split on what they do with a dark-mode-aware email, so each
// behavior gets its own button rather than one toggle guessing between them.
const modes = [
  {
    value: 'inversion',
    label: 'Emulated color inversion',
    Icon: IconContrast,
    description:
      'Inverts the colors of the light theme, like clients that ignore prefers-color-scheme do — Gmail, Outlook.com.',
  },
  {
    value: 'native',
    label: 'Dark styles defined by the email',
    Icon: IconMoon,
    description:
      'Renders the dark styles the email defines, like clients that honor prefers-color-scheme do — Apple Mail, Outlook for Mac.',
  },
] as const;

export const DarkModeToggleGroup = ({
  mode,
  onChange,
}: DarkModeToggleGroupProps) => {
  return (
    <ToggleGroup.Root
      aria-label="Dark mode"
      className="flex items-center h-9 border border-slate-6 rounded-lg overflow-hidden"
      onValueChange={(value) => {
        onChange(value === '' ? 'off' : (value as DarkModePreview));
      }}
      type="single"
      value={mode === 'off' ? '' : mode}
    >
      {modes.map(({ value, label, Icon, description }) => (
        <Tooltip key={value}>
          <Tooltip.Trigger asChild>
            <ToggleGroup.Item
              // The tooltip trigger merges its own `data-state` onto this
              // element, so the selected style keys off `aria-checked` — the
              // attribute the toggle group actually owns.
              aria-label={label}
              className={cn(
                'w-9 h-full flex items-center justify-center transition duration-200 ease-in-out',
                'text-slate-11 hover:text-slate-12',
                'aria-checked:bg-slate-4 aria-checked:text-slate-12',
              )}
              value={value}
            >
              <Icon />
            </ToggleGroup.Item>
          </Tooltip.Trigger>
          <Tooltip.Content>{description}</Tooltip.Content>
        </Tooltip>
      ))}
    </ToggleGroup.Root>
  );
};
