import { SearchIcon } from 'lucide-react';

export default function Illustration() {
  return (
    <div className="relative flex w-[40%] flex-col gap-2 rounded-md border-2 border-dashed border-transparent bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-4 shadow-xs transition-all duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:border-slate-4 group-hover:via-black/20 group-hover:to-[#25AEBA]/5 before:absolute before:top-1/2 before:left-3 before:h-full before:w-1 before:border-l-2 before:border-dashed before:border-transparent before:content-[''] group-hover:before:border-slate-4 after:absolute after:top-1/2 after:right-3 after:h-full before:-translate-y-1/2 after:w-1 after:border-r-2 after:border-dashed after:border-transparent after:content-[''] group-hover:after:border-slate-4 after:-translate-y-1/2 md:group-hover:skew-x-2 before:transition-all after:transition-all before:transition-duration-150 before:ease-[cubic-bezier(.42,0,.58,1.8)] after:transition-duration-150 after:ease-[cubic-bezier(.42,0,.58,1.8)]">
      <div className="absolute top-[84%] left-[66%] -translate-x-1/2 group-hover:-translate-y-3 group-hover:translate-x-0 rotate-50 opacity-0 group-hover:rotate-0 group-hover:opacity-100 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]">
        <SearchIcon
          strokeWidth={3}
          className="h-6 w-6 text-[#25AEBA] fill-slate-4"
        />
      </div>
      <div className="flex w-full gap-1">
        <div className="h-1 w-[24%] rounded-xs bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)] transition-colors ease-in-out group-hover:bg-slate-8" />
        <div className="h-1 shrink grow basis-0 rounded-xs bg-slate-5" />
      </div>
      <div className="h-1 w-[80%] rounded-xs bg-slate-5" />
      <div className="h-1 w-[60%] rounded-xs bg-slate-5" />
      <div className="h-1 w-[24%] rounded-xs bg-slate-7 shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)] transition-colors ease-in-out group-hover:bg-[#25AEBA]" />
      <div />
      <div />
      <div className="h-1 w-[24%] rounded-xs bg-slate-7" />
      <div className="h-1 w-[36%] rounded-xs bg-slate-7" />
    </div>
  );
}
