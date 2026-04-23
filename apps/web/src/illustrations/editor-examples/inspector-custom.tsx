const Illustration = () => (
  <div className="group-hover:-skew-x-4 relative overflow-hidden flex w-[30%] translate-y-3 flex-col gap-2 rounded-sm bg-[#260D30] bg-linear-to-b from-transparent to-black/20 p-4 pt-5 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]">
    <div className="absolute top-0 h-2 w-full left-0 flex gap-0.5 pl-1 items-center justify-start bg-purple-8">
      <div className="h-1 aspect-square rounded-full bg-black/60" />
      <div className="h-1 aspect-square rounded-full bg-black/60" />
      <div className="h-1 aspect-square rounded-full bg-black/60" />
    </div>
    <div className="flex w-[80%] items-start gap-2 transition-transform duration-100 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-0.5">
      <div className="h-2 w-2 rounded-full bg-[#EAA1FF]" />
      <div className="flex shrink grow basis-0 flex-col gap-1">
        <div className="h-2 w-full rounded-xs bg-purple-7" />
        <div className="h-2 w-3/4 rounded-xs bg-purple-5" />
      </div>
    </div>
    <div className="flex w-[70%] items-start gap-2 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-1">
      <div className="h-2 w-2 rounded-full bg-[#EAA1FF]" />
      <div className="flex shrink grow basis-0 flex-col gap-1">
        <div className="h-2 w-full rounded-xs bg-purple-7" />
        <div className="h-2 w-3/4 rounded-xs bg-purple-5" />
      </div>
    </div>
  </div>
);

export default Illustration;
