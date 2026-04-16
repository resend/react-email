import { MoveDownRightIcon } from 'lucide-react';

const IllustrationTimeline: React.FC = () => (
  <div className="group-hover:-skew-x-4 relative flex w-[25%] translate-y-3 flex-col gap-2 rounded-md bg-[#260D30] bg-linear-to-b from-transparent to-black/20 p-2 group-hover:p-0 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]">
    <div className="relative w-full flex p-1 items-center justify-start h-full rounded-sm border-[#EAA1FF] border border-dashed bg-purple-4 text-[#EAA1FF] shadow-[0px_0px_9px_4px_rgba(234,161,255,0.10)]">
      <MoveDownRightIcon
        className="absolute opacity-0 top-[calc(100%-.5rem)] left-[calc(100%-.5rem)] transition-all duration-150 group-hover:duration-500 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:opacity-100"
        size={16}
        strokeWidth={4}
      />
      <div className="h-full min-h-3 w-px rounded-xs transition-all duration-200 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:bg-[#EAA1FF] group-hover:w-full" />
    </div>
  </div>
);

export default IllustrationTimeline;
