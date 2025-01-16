import { CircleDollarSign } from 'lucide-react';

const IllustrationEcommerce: React.FC = () => (
  <div className="relative flex aspect-video w-[42%] items-center gap-2 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 px-3 py-2 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <div className="flex aspect-square w-[42%] items-center justify-center rounded-sm bg-slate-4">
      <CircleDollarSign className="opacity-10 transition-opacity group-hover:opacity-20" />
    </div>
    <div className="flex shrink grow basis-0 flex-col gap-1">
      <div className="h-2 w-[84%] rounded-sm bg-slate-5" />
      <div className="h-2 w-[66%] rounded-sm bg-slate-5" />
      <div className="mt-0.5 h-2 w-[40%] rounded-sm border border-[#2EBDC9] bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)]" />
    </div>
  </div>
);

export default IllustrationEcommerce;
