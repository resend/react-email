import { ChevronDownIcon, MousePointer2Icon } from 'lucide-react';

const Illustration = () => (
  <div className="relative flex w-[32%] translate-y-3 flex-col gap-1.5 rounded-md bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-4 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2">
    <div className="h-2 w-[90%] rounded-xs bg-green-5" />
    <div className="flex h-3 w-full items-center justify-center gap-1 rounded-xs bg-green-5 p-1">
      <div className="h-full shrink grow basis-0 rounded-xs bg-[#25BA72]/40 transition-colors duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:bg-[#25BA72]/80" />
      <ChevronDownIcon
        size={10}
        strokeWidth={4}
        className="ml-auto transition-colors duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:text-[#25BA72]"
      />
    </div>
    <div className="mt-2 flex items-center gap-1">
      <div className="h-2 shrink-0 grow basis-0 rounded-xs bg-[#25BA72]" />
      <div className="h-2 shrink-0 grow basis-0 rounded-xs bg-[#25BA72]" />
      <div className="h-2 shrink-0 grow basis-0 rounded-xs bg-[#25BA72]" />
      <div className="h-2 shrink-0 grow basis-0 rounded-xs bg-[#25BA72]" />
    </div>
    <MousePointer2Icon
      className="absolute -bottom-4 right-[40%] rotate-60 text-white transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-translate-y-3 group-hover:translate-x-3"
      fill="currentColor"
      stroke="currentColor"
    />
  </div>
);

export default Illustration;
