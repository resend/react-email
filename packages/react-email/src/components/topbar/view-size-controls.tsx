import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from '../button';
import { IconArrowDown } from '../icons/icon-arrow-down';

interface ViewSizeControlsProps {
  viewWidth: number;
  setViewWidth: (width: number) => void;
  viewHeight: number;
  setViewHeight: (height: number) => void;
}

export const ViewSizeControls = ({
  viewWidth,
  viewHeight,
  setViewWidth,
  setViewHeight,
}: ViewSizeControlsProps) => {
  return (
    <>
      <div className="relative p-0 m-0 w-fit h-fit">
        <input
          className="pl-6 w-24 arrow-hide pr-2 py-2 outline-none bg-black focus:border-white text-sm border-2 border-solid border-slate-6 rounded-md "
          onChange={(e) => {
            setViewWidth(Number.parseInt(e.currentTarget.value));
          }}
          type="number"
          value={viewWidth}
        />
        <span className="absolute text-sm left-2 top-1/2 font-bold -translate-y-1/2">W</span>
      </div>
      <div className="relative p-0 m-0 w-fit h-fit">
        <input
          className="pl-6 w-24 arrow-hide pr-2 py-2 outline-none bg-black focus:border-white text-sm border-2 border-solid border-slate-6 rounded-md "
          onChange={(e) => {
            setViewHeight(Number.parseInt(e.currentTarget.value));
          }}
          type="number"
          value={viewHeight}
        />
        <span className="absolute text-sm left-2 top-1/2 font-bold -translate-y-1/2">H</span>
      </div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button appearance="white">
            View presets
            <IconArrowDown />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="min-w-[12rem] rounded-md bg-black px-2 py-2 flex flex-col gap-2 text-white border border-solid border-slate-8"
            sideOffset={5}
          >
            <ViewPresetDropdownMenuItem
              height={600}
              onClick={() => {
                setViewWidth(600);
                setViewHeight(1024);
              }}
              width={1024}
            >
              Desktop
            </ViewPresetDropdownMenuItem>
            <ViewPresetDropdownMenuItem
              height={812}
              onClick={() => {
                setViewWidth(375);
                setViewHeight(812);
              }}
              width={375}
            >
              Mobile
            </ViewPresetDropdownMenuItem>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

interface ViewPresetDropdownMenuItemProps {
  children?: React.ReactNode;
  onClick?: () => void;

  width?: number;
  height?: number;
}

const ViewPresetDropdownMenuItem = ({
  children,
  onClick,
  width,
  height,
}: ViewPresetDropdownMenuItemProps) => {
  return (
    <DropdownMenu.Item
      className="flex w-full rounded-md select-none px-2 py-1 items-center outline-none transition-colors data-[highlighted]:bg-white/30"
      onClick={onClick}
    >
      {children}{' '}
      <span className="ml-auto text-sm flex items-center font-bold bg-white/30 rounded-lg text-white px-1 h-fit">
        {width}x{height}
      </span>
    </DropdownMenu.Item>
  );
};
