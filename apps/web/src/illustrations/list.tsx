const IllustrationTimeline: React.FC = () => (
  <div className="group-hover:-skew-x-6 relative flex w-[40%] translate-y-3 flex-col gap-4 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 p-4 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]">
    <div className="h-1 w-[84%] rounded-sm bg-slate-8" />
    <div className="flex w-[66%] items-start gap-2 transition-transform duration-100 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-0.5">
      <div className="h-2 w-2 rounded-full bg-[#25AEBA]" />
      <div className="flex shrink grow basis-0 flex-col gap-1">
        <div className="h-1 w-full rounded-sm bg-slate-7" />
        <div className="h-1 w-3/4 rounded-sm bg-slate-5" />
      </div>
    </div>
    <div className="flex w-[66%] items-start gap-2 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-1">
      <div className="h-2 w-2 rounded-full bg-[#25AEBA]" />
      <div className="flex shrink grow basis-0 flex-col gap-1">
        <div className="h-1 w-full rounded-sm bg-slate-7" />
        <div className="h-1 w-3/4 rounded-sm bg-slate-5" />
      </div>
    </div>
  </div>
);

export default IllustrationTimeline;
