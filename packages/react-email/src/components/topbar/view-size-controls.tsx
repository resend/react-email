import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { IconArrowDown } from '../icons/icon-arrow-down';
import { cn } from '../../utils';
import { useState } from 'react';

interface ViewDimensions {
  width: number;
  height: number;
}

interface ViewSizeControlsProps {
  viewWidth: number;
  setViewWidth: (width: number) => void;
  viewHeight: number;
  setViewHeight: (height: number) => void;
}

interface DimensionInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const DimensionInput = ({ label, value, onChange }: DimensionInputProps) => (
  <div className="relative">
    <input
      className="arrow-hide relative flex h-8 w-fit min-w-0 max-w-20 items-center justify-center bg-black py-0 pl-7 text-sm outline-none"
      onChange={(e) => onChange(Number.parseInt(e.currentTarget.value))}
      type="number"
      value={value}
    />
    <span className="-translate-y-1/2 absolute top-1/2 left-2 font-bold text-xs">
      {label}
    </span>
  </div>
);

interface PresetOption {
  name: string;
  dimensions: ViewDimensions;
}

const VIEW_PRESETS: PresetOption[] = [
  { name: 'Desktop', dimensions: { width: 600, height: 1024 } },
  { name: 'Mobile', dimensions: { width: 375, height: 812 } },
];

interface PresetMenuItemProps {
  name: string;
  dimensions: ViewDimensions;
  onSelect: (dimensions: ViewDimensions) => void;
}

const PresetMenuItem = ({
  name,
  dimensions,
  onSelect,
}: PresetMenuItemProps) => (
  <DropdownMenu.Item
    className="group flex w-full cursor-pointer select-none items-center justify-between rounded-md py-1.5 pr-1 pl-2 text-sm outline-none transition-colors data-[highlighted]:bg-slate-5"
    onClick={() => onSelect(dimensions)}
  >
    {name}
    <span className="flex h-fit items-center rounded-full bg-slate-6 px-1.5 py-0.5 font-bold text-white text-xs">
      {dimensions.width}x{dimensions.height}
    </span>
  </DropdownMenu.Item>
);

export const ViewSizeControls = ({
  viewWidth,
  viewHeight,
  setViewWidth,
  setViewHeight,
}: ViewSizeControlsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handlePresetSelect = (dimensions: ViewDimensions) => {
    setViewWidth(dimensions.width);
    setViewHeight(dimensions.height);
  };

  return (
    <div className="relative flex h-9 w-fit overflow-hidden rounded-lg border border-slate-6 pl-1.5 text-sm transition-colors duration-300 ease-in-out focus-within:border-slate-8 hover:border-slate-8">
      <DimensionInput label="W" value={viewWidth} onChange={setViewWidth} />
      <DimensionInput label="H" value={viewHeight} onChange={setViewHeight} />
      <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="relative flex items-center justify-center gap-1.5 overflow-hidden bg-slate-5 py-2 pr-2 pl-3 text-slate-11 text-sm leading-none outline-none transition-colors ease-linear focus-within:text-slate-12 hover:text-slate-12 focus:text-slate-12"
          >
            <span>View presets</span>
            <IconArrowDown
              className={cn(
                'transform transition-transform duration-200 ease-[cubic-bezier(.36,.66,.6,1)]',
                {
                  '-rotate-180': isDropdownOpen,
                },
              )}
            />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="flex min-w-[12rem] flex-col gap-2 rounded-md border border-slate-8 border-solid bg-black px-2 py-2 text-white"
            sideOffset={5}
          >
            {VIEW_PRESETS.map((preset) => (
              <PresetMenuItem
                key={preset.name}
                name={preset.name}
                dimensions={preset.dimensions}
                onSelect={handlePresetSelect}
              />
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
