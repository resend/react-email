import { MousePointer2Icon } from 'lucide-react';

export default function Illustration() {
  return (
    <div className="w-full h-full relative flex flex-col gap-2 items-center justify-center pt-2">
      <div className="w-20 h-15 overflow-hidden bg-[#3D3517] rounded-md relative shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:rotate-2">
        <div className="w-3 h-3 bg-[#ffca16] rounded-full absolute top-2 right-2 shadow-[0_0_.5625rem_.25rem_rgba(255,208,24,.18)]" />
        <div className="w-full h-full absolute -bottom-1">
          <div className="w-[60%] h-[30%] bg-[#2B2510] rounded-[50%_50%_100%_0/38%_100%_0_62%] absolute bottom-0 left-0" />
          <div className="w-[80%] h-[60%] bg-[#1E1A0C] rounded-[69%_31%_100%_0/58%_100%_0_42%] absolute bottom-0 right-0" />
        </div>
      </div>
      <div className="w-16 h-1.5 relative overflow-hidden rounded-md bg-[#ffca16]/20 opacity-0 -translate-y-1 before:content-[''] before:absolute before:w-0 before:h-full before:bg-[#ffca16] group-hover:before:w-full before:transition-all before:duration-700 before:ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:opacity-100 group-hover:-translate-y-0" />
      <MousePointer2Icon
        className="absolute top-[66%] left-[66%] text-white transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-translate-y-4 group-hover:-translate-x-6 group-hover:-rotate-12"
        fill="currentColor"
        stroke="currentColor"
      />
    </div>
  );
}
