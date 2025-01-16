import { MoveDownRightIcon } from 'lucide-react';

const IllustrationGrid: React.FC = () => (
  <div className="relative grid aspect-square w-[24%] grid-cols-2 grid-rows-2 items-center gap-2 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 p-2 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <div className="col-span-1 h-full rounded-sm bg-slate-3" />
    <div className="col-span-1 h-full rounded-sm bg-slate-3 bg-gradient-to-l from-slate-1 to-slate-3" />
    <div className="col-span-1 h-full rounded-sm bg-slate-3 bg-gradient-to-b from-slate-3 to-slate-1" />
    <div className="relative col-span-1 h-full rounded-sm border border-[.1875rem] border-[#25AEBA] border-[#2EBDC9] bg-slate-4 text-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)] transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:scale-125">
      <MoveDownRightIcon
        className="absolute left-[calc(100%-.125rem)] top-[calc(100%-.125rem)]"
        size={14}
        strokeWidth={4}
      />
    </div>
  </div>
);

export default IllustrationGrid;
