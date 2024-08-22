import { ChevronRightIcon } from "lucide-react";

const IllustrationCodeInline: React.FC = () => (
  <div className="relative w-[40%] p-3 shadow-sm bg-slate-3 flex gap-2 items-center rounded-full transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <ChevronRightIcon size={14} strokeWidth={4}/>
    <div className="w-[24%] h-1 rounded-sm bg-[#236380] group-hover:bg-slate-8 transition-colors ease-in-out" />
      <div className="shrink grow basis-0 h-1 rounded-sm bg-slate-5"/>
      <div className="w-1 h-3 rounded-sm bg-slate-11"/>
  </div>
);

export default IllustrationCodeInline;