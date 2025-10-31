import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';
import { cn } from '../../utils';
import { IconArrowDown } from '../icons/icon-arrow-down';
import { Tooltip } from '../tooltip';

interface ViewDimensions {
  width: number;
  height: number;
}

interface ViewSizeControlsProps {
  minWidth: number;
  minHeight: number;
  viewWidth: number;
  setViewWidth: (width: number) => void;
  viewHeight: number;
  setViewHeight: (height: number) => void;
}

interface PresetOption {
  name: string;
  dimensions: ViewDimensions;
  icon: React.ReactNode;
}

export const VIEW_PRESETS: PresetOption[] = [
  {
    name: 'Desktop',
    dimensions: { width: 1024, height: 600 },
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M1 3.25C1 3.11193 1.11193 3 1.25 3H13.75C13.8881 3 14 3.11193 14 3.25V10.75C14 10.8881 13.8881 11 13.75 11H1.25C1.11193 11 1 10.8881 1 10.75V3.25ZM1.25 2C0.559643 2 0 2.55964 0 3.25V10.75C0 11.4404 0.559644 12 1.25 12H5.07341L4.82991 13.2986C4.76645 13.6371 5.02612 13.95 5.37049 13.95H9.62951C9.97389 13.95 10.2336 13.6371 10.1701 13.2986L9.92659 12H13.75C14.4404 12 15 11.4404 15 10.75V3.25C15 2.55964 14.4404 2 13.75 2H1.25ZM9.01091 12H5.98909L5.79222 13.05H9.20778L9.01091 12Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'Mobile',
    dimensions: { width: 375, height: 667 },
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M4 2.5C4 2.22386 4.22386 2 4.5 2H10.5C10.7761 2 11 2.22386 11 2.5V12.5C11 12.7761 10.7761 13 10.5 13H4.5C4.22386 13 4 12.7761 4 12.5V2.5ZM4.5 1C3.67157 1 3 1.67157 3 2.5V12.5C3 13.3284 3.67157 14 4.5 14H10.5C11.3284 14 12 13.3284 12 12.5V2.5C12 1.67157 11.3284 1 10.5 1H4.5ZM6 11.65C5.8067 11.65 5.65 11.8067 5.65 12C5.65 12.1933 5.8067 12.35 6 12.35H9C9.1933 12.35 9.35 12.1933 9.35 12C9.35 11.8067 9.1933 11.65 9 11.65H6Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export const ViewSizeControls = ({
  minWidth,
  minHeight,
  viewWidth,
  viewHeight,
  setViewWidth,
  setViewHeight,
}: ViewSizeControlsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [internalWidth, setInternalWidth] = React.useState(viewWidth);
  const [internalHeight, setInternalHeight] = React.useState(viewHeight);

  const handlePresetSelect = (dimensions: ViewDimensions) => {
    setViewWidth(dimensions.width);
    setViewHeight(dimensions.height);
  };

  React.useEffect(() => {
    setInternalWidth(viewWidth);
    setInternalHeight(viewHeight);
  }, [viewWidth, viewHeight]);

  return (
    <div className="relative flex h-9 w-fit overflow-hidden rounded-lg border border-slate-6 text-sm transition-colors duration-300 ease-in-out">
      {VIEW_PRESETS.map((preset) => (
        <Tooltip>
          <Tooltip.Trigger asChild>
            <button
              key={preset.name}
              onClick={() => handlePresetSelect(preset.dimensions)}
              className={cn(
                'relative flex items-center justify-center w-9 transition-colors hover:text-slate-12',
                {
                  'bg-slate-4':
                    viewWidth === preset.dimensions.width &&
                    viewHeight === preset.dimensions.height,
                },
              )}
              type="button"
            >
              {preset.icon}
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>{preset.name}</Tooltip.Content>
        </Tooltip>
      ))}

      <Popover.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="relative flex items-center justify-center overflow-hidden w-9 text-slate-11 text-sm leading-none outline-none transition-colors ease-linear focus-within:text-slate-12 hover:text-slate-12 focus:text-slate-12"
          >
            <span className="sr-only">View presets</span>
            <IconArrowDown
              className={cn(
                'transform transition-transform duration-200 ease-[cubic-bezier(.36,.66,.6,1)]',
                {
                  '-rotate-180': isDropdownOpen,
                },
              )}
            />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            className="flex min-w-[12rem] flex-col gap-2 rounded-md border border-slate-8 border-solid bg-black px-2 py-2 text-white"
            sideOffset={5}
          >
            <div className="flex w-full items-center justify-between text-sm gap-2">
              <span className="font-medium text-slate-11 text-xs">Width</span>
              <input
                type="number"
                value={internalWidth}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setInternalWidth(value);

                  if (value >= minWidth) {
                    setViewWidth(value);
                  }
                }}
                className="w-20 appearance-none rounded-lg border border-slate-6 bg-slate-5 px-1 py-1 text-sm text-slate-12 placeholder-slate-10 outline-none transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
              />
            </div>

            <div className="flex w-full items-center justify-between text-sm gap-2">
              <span className="font-medium text-slate-11 text-xs">Height</span>
              <input
                type="number"
                value={internalHeight}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setInternalHeight(value);

                  if (value >= minHeight) {
                    setViewHeight(value);
                  }
                }}
                className="w-20 appearance-none rounded-lg border border-slate-6 bg-slate-5 px-1 py-1 text-sm text-slate-12 placeholder-slate-10 outline-none transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
              />
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
