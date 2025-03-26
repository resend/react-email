import { MousePointer2Icon } from 'lucide-react';

const IllustrationFeedback: React.FC = () => (
  <div className="relative flex w-[40%] translate-y-3 flex-col gap-4 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 p-4 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <div className="flex flex-col gap-1">
      <div className="h-2 w-[90%] rounded-sm bg-slate-5" />
      <div className="h-2 w-[66%] rounded-sm bg-slate-5" />
    </div>
    <div className="flex items-center gap-2">
      <div className="h-2 shrink-0 grow basis-0 rounded-sm bg-[#25AEBA]" />
      <div className="h-2 shrink-0 grow basis-0 rounded-sm bg-[#25AEBA]" />
      <div className="h-2 shrink-0 grow basis-0 rounded-sm bg-[#25AEBA]" />
      <div className="h-2 shrink-0 grow basis-0 rounded-sm bg-[#25AEBA]" />
    </div>
    <MousePointer2Icon
      className="-bottom-4 group-hover:-translate-y-3 absolute right-[40%] rotate-[60deg] transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-3"
      fill="currentColor"
      stroke="currentColor"
    />
  </div>
);

export default IllustrationFeedback;
