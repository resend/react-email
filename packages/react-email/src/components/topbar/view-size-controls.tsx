import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import * as React from 'react';
import { cn } from '../../utils';
import { IconArrowDown } from '../icons/icon-arrow-down';
import { Tooltip } from '../tooltip';

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
  icon: React.ReactNode;
  isActive: boolean;
  label: string;
  onBlur: () => void;
  onChange: (value: number) => void;
  setIsActive: (active: boolean) => void;
  value: number;
  hasBorder?: boolean;
}

interface PresetOption {
  name: string;
  dimensions: ViewDimensions;
}

interface PresetMenuItemProps {
  name: string;
  dimensions: ViewDimensions;
  onSelect: (dimensions: ViewDimensions) => void;
}

const VIEW_PRESETS: PresetOption[] = [
  { name: 'Desktop', dimensions: { width: 600, height: 1024 } },
  { name: 'Mobile', dimensions: { width: 375, height: 812 } },
];

const inputVariant = {
  active: {
    width: '3.5rem',
    padding: '0 0 0 0.5rem',
  },
  inactive: {
    width: '0',
  },
};

const DimensionInput = ({
  icon,
  isActive,
  label,
  onBlur,
  onChange,
  setIsActive,
  value,
  hasBorder,
}: DimensionInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleButtonClick = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };

  return (
    <Tooltip.Provider>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <motion.button
            onClick={handleButtonClick}
            className={cn('relative flex items-center justify-center p-2', {
              'border-slate-6 border-r': hasBorder,
            })}
          >
            {icon}
            <motion.input
              ref={inputRef}
              initial={false}
              animate={isActive ? 'active' : 'inactive'}
              className="arrow-hide relative flex h-8 items-center justify-center bg-black text-sm outline-none"
              onChange={(e) => onChange(Number.parseInt(e.currentTarget.value))}
              onBlur={onBlur}
              type="number"
              value={value}
              variants={inputVariant}
            />
          </motion.button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <span>{label}: </span>
          <span className="font-mono">{value}px</span>
        </Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>
  );
};

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
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [activeInput, setActiveInput] = React.useState<
    'width' | 'height' | null
  >(null);

  const handlePresetSelect = (dimensions: ViewDimensions) => {
    setViewWidth(dimensions.width);
    setViewHeight(dimensions.height);
  };

  const handleBlur = () => {
    setActiveInput(null);
  };

  return (
    <div className="relative flex h-9 w-fit overflow-hidden rounded-lg border border-slate-6 text-sm transition-colors duration-300 ease-in-out focus-within:border-slate-8 hover:border-slate-8">
      <DimensionInput
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
            <path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" />
            <path d="M4 12H2" />
            <path d="M10 12H8" />
            <path d="M16 12h-2" />
            <path d="M22 12h-2" />
          </svg>
        }
        value={viewWidth}
        onChange={setViewWidth}
        isActive={activeInput === 'width'}
        setIsActive={(active) => setActiveInput(active ? 'width' : null)}
        onBlur={handleBlur}
        label="Width"
        hasBorder
      />
      <DimensionInput
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" />
            <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
            <path d="M12 20v2" />
            <path d="M12 14v2" />
            <path d="M12 8v2" />
            <path d="M12 2v2" />
          </svg>
        }
        value={viewHeight}
        onChange={setViewHeight}
        isActive={activeInput === 'height'}
        setIsActive={(active) => setActiveInput(active ? 'height' : null)}
        onBlur={handleBlur}
        label="Height"
      />
      <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="relative flex items-center justify-center overflow-hidden bg-slate-5 p-2 text-slate-11 text-sm leading-none outline-none transition-colors ease-linear focus-within:text-slate-12 hover:text-slate-12 focus:text-slate-12"
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
