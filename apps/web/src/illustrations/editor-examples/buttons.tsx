import { BoltIcon, MousePointer2Icon } from 'lucide-react';

const Illustration = () => (
  <div className="relative flex h-6 w-[24%] items-center justify-center rounded-md border border-[#2B2510] bg-[#2B2510] p-1 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:rotate-3">
    <div className="h-2 w-[80%] rounded-xs bg-black/30 group-hover:bg-[#FFD018]">
      <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 group-hover:animate-bounce">
        <BoltIcon className="h-0 w-0 fill-current text-[#473e1a] transition-all duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:h-4 group-hover:w-4 group-hover:animate-spin group-hover:text-[#FFD018] [&>circle]:fill-[#473e1a]!" />
      </span>
    </div>
    <MousePointer2Icon
      className="-bottom-4 text-white md:group-hover:-rotate-12 absolute left-[80%] transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]"
      fill="currentColor"
      stroke="currentColor"
    />
  </div>
);

export default Illustration;
