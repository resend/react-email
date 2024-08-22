import { ChevronRightIcon } from "lucide-react";

const IllustrationCodeInline: React.FC = () => (
  <div className="relative flex w-[40%] items-center gap-2 rounded-full bg-[#0D0E0E] p-3 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <ChevronRightIcon size={14} strokeWidth={4} />
    <div className="h-1 w-[24%] rounded-sm bg-[#236380] transition-colors ease-in-out group-hover:bg-slate-8" />
    <div className="h-1 shrink grow basis-0 rounded-sm bg-slate-5" />
    <div className="h-3 w-1 rounded-sm bg-slate-11" />
  </div>
);

export default IllustrationCodeInline;
