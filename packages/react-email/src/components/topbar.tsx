'use client';

import { use } from 'react';
import { Heading } from './heading';
import { IconHideSidebar } from './icons/icon-hide-sidebar';
import { ShellContext } from './shell';
import { Tooltip } from './tooltip';

interface TopbarProps {
  currentEmailOpenSlug: string;
  pathSeparator: string;

  children: React.ReactNode;
}

export const Topbar = ({
  currentEmailOpenSlug,
  pathSeparator,
  children,
}: TopbarProps) => {
  const { toggleSidebar } = use(ShellContext)!;

  return (
    <Tooltip.Provider>
      <header className="relative flex h-[3.3125rem] items-center justify-between gap-3 border-slate-6 border-b px-3">
        <div className="relative flex w-fit items-center gap-3">
          <Tooltip>
            <Tooltip.Trigger asChild>
              <button
                className="relative hidden rounded-lg px-2 py-2 text-slate-11 transition duration-200 ease-in-out hover:bg-slate-5 hover:text-slate-12 lg:flex"
                onClick={() => {
                  toggleSidebar();
                }}
                type="button"
              >
                <IconHideSidebar height={20} width={20} />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>Show/hide sidebar</Tooltip.Content>
          </Tooltip>
          <div className="hidden items-center overflow-hidden text-center lg:flex">
            <Heading as="h2" className="truncate" size="2" weight="medium">
              {currentEmailOpenSlug.split(pathSeparator).pop()}
            </Heading>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 lg:w-fit lg:justify-start">
          {children}
          {/* {setViewWidth && setViewHeight && viewWidth && viewHeight ? ( */}
          {/*   <ViewSizeControls */}
          {/*     setViewHeight={setViewHeight} */}
          {/*     setViewWidth={setViewWidth} */}
          {/*     viewHeight={viewHeight} */}
          {/*     viewWidth={viewWidth} */}
          {/*   /> */}
          {/* ) : null} */}
          {/* {activeView && setActiveView ? ( */}
          {/*   <ActiveViewToggleGroup */}
          {/*     activeView={activeView} */}
          {/*     setActiveView={setActiveView} */}
          {/*   /> */}
          {/* ) : null} */}
          {/* {markup ? ( */}
          {/*   <div className="flex justify-end"> */}
          {/*     <Send markup={markup} /> */}
          {/*   </div> */}
          {/* ) : null} */}
        </div>
      </header>
    </Tooltip.Provider>
  );
};
