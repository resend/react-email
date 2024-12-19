import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const IllustrationContainer: React.FC = () => (
  <div className="relative flex w-[40%] items-center rounded-full bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 p-3 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <ChevronLeftIcon
      className="translate-x-2 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-0"
      size={14}
      strokeWidth={4}
    />
    <div className="h-1 shrink grow basis-0 rounded-sm bg-slate-8" />
    <ChevronRightIcon
      className="-translate-x-2 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-0"
      size={14}
      strokeWidth={4}
    />
  </div>
);

export default IllustrationContainer;
