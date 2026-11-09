'use client';

import { usePreviewContext } from '../contexts/preview';
import { usePropsPanel } from '../contexts/props-panel';
import { cn } from '../utils';
import { PreviewPropsEditor } from './preview-props-editor';

export const PreviewPropsPanel = ({ open }: { open: boolean }) => {
  const { animated } = usePropsPanel();
  const { emailSlug } = usePreviewContext();

  return (
    <aside
      className={cn(
        'shrink-0 overflow-hidden border-l border-slate-6',
        animated && 'transition-[width] duration-200 will-change-[width]',
        open ? 'w-72' : 'w-0 border-l-0',
      )}
      inert={!open}
    >
      <div className="flex h-full w-72 flex-col">
        <div className="flex h-10 shrink-0 items-center border-b border-slate-6 px-4 font-medium text-slate-12 text-xs">
          Props
        </div>
        <div className="grow overflow-y-auto px-4 pt-3 text-slate-11 text-xs">
          <PreviewPropsEditor key={emailSlug} />
        </div>
      </div>
    </aside>
  );
};
