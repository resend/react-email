import { CircleDollarSign } from 'lucide-react';

const IllustrationMarketing: React.FC = () => (
  <div className="relative flex aspect-square w-[40%] flex-col items-center justify-center gap-2 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 p-3 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-3">
    <div className="w-full flex flex-col items-center justify-center gap-1">
      <div className="flex aspect-video w-full items-center justify-center gap-2">
        <div className="flex aspect-square w-[54%] items-center justify-center rounded-sm bg-slate-4">
          <CircleDollarSign className="opacity-10 transition-all group-hover:opacity-20 group-hover:scale-110" />
        </div>
      </div>
      <div className="flex w-[54%] flex-col gap-1">
        <div className="h-2 w-full rounded-sm bg-slate-5" />
        <div className="h-2 w-full mt-1 rounded-sm border border-[#2EBDC9] bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)] group-hover:-skew-x-3" />
      </div>
    </div>
  </div>
);

export default IllustrationMarketing;
