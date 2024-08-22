import { MoveDownRightIcon } from "lucide-react";

const IllustrationGrid: React.FC = () => (
  <div className="relative grid aspect-square w-[24%] grid-cols-2 grid-rows-2 items-center gap-2 rounded-md bg-[#0D0E0E] p-2 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <div className="col-span-1 h-full rounded-sm bg-slate-3" />
    <div className="col-span-1 h-full rounded-sm bg-slate-3 bg-gradient-to-l from-slate-1 to-slate-3" />
    <div className="col-span-1 h-full rounded-sm bg-slate-3 bg-gradient-to-b from-slate-3 to-slate-1" />
    <div className="relative col-span-1 h-full rounded-sm border-[.1875rem] border-[#236380] bg-slate-4 text-[#236380] transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:scale-125">
      <MoveDownRightIcon
        className="absolute left-[calc(100%-.125rem)] top-[calc(100%-.125rem)]"
        size={14}
        strokeWidth={4}
      />
    </div>
  </div>
);

export default IllustrationGrid;
