import { ChevronRightIcon } from 'lucide-react';

const Illustration = () => (
  <div className="relative flex w-[35%] items-center gap-1.5 rounded-lg bg-[#2D0D4D] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2">
    <ChevronRightIcon
      size={16}
      strokeWidth={4}
      className="group-hover:translate-x-0.5 transition-transform duration-200 ease-in-out"
    />
    <div className="h-3 w-[24%] rounded-xs border border-[#EAA1FF] bg-[#EAA1FF] shadow-[0px_0px_9px_4px_rgba(234,161,255,0.10)] transition-colors ease-in-out" />
    <div className="h-3 shrink grow basis-0 rounded-xs bg-slate-5" />
  </div>
);

export default Illustration;
