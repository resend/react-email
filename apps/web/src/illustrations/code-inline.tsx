import { ChevronRightIcon } from 'lucide-react';

const IllustrationCodeInline: React.FC = () => (
  <div className="relative flex w-[40%] items-center gap-2 rounded-full bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-3 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2">
    <ChevronRightIcon size={14} strokeWidth={4} />
    <div className="h-1 w-[24%] rounded-xs border border-[#2EBDC9] bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)] transition-colors ease-in-out" />
    <div className="h-1 shrink grow basis-0 rounded-xs bg-slate-5" />
  </div>
);

export default IllustrationCodeInline;
