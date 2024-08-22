import { CircleDollarSign } from "lucide-react";

const IllustrationMarketing: React.FC = () => (
  <div className="relative flex aspect-square w-[40%] flex-col items-center gap-2 rounded-md bg-[#0D0E0E] p-3 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-skew-x-3">
    <div className="mt-1 h-1 w-[24%] rounded-sm bg-[#236380]" />
    <div className="h-2 w-[72%] rounded-sm bg-slate-5" />
    <div className="h-3 w-[66%] rounded-sm bg-slate-5" />
    <div className="flex aspect-video w-full items-center gap-2">
      <div className="flex aspect-square w-[42%] items-center justify-center rounded-sm bg-slate-4">
        <CircleDollarSign className="opacity-10 transition-opacity group-hover:opacity-20" />
      </div>
      <div className="flex shrink grow basis-0 flex-col gap-1">
        <div className="h-2 w-[84%] rounded-sm bg-slate-5" />
        <div className="h-3 w-[66%] rounded-sm bg-slate-5" />
        <div className="mt-1 h-2 w-[30%] rounded-sm bg-[#236380]" />
      </div>
    </div>
  </div>
);

export default IllustrationMarketing;
