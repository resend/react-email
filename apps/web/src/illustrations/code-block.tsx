const IllustrationCodeBlock: React.FC = () => (
  <div className="relative flex aspect-square w-[40%] flex-col gap-2 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 p-4 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <div className="flex w-full gap-1">
      <div className="h-1 w-[24%] rounded-sm bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)] transition-colors ease-in-out group-hover:bg-slate-8" />
      <div className="h-1 shrink grow basis-0 rounded-sm bg-slate-5" />
    </div>
    <div className="flex w-full gap-1">
      <div className="h-1 shrink grow basis-0 rounded-sm bg-slate-5 transition-colors ease-in-out group-hover:bg-slate-7" />
      <div className="h-1 w-[42%] rounded-sm bg-slate-4" />
    </div>
    <div className="flex w-full gap-1">
      <div className="h-1 w-[36%] rounded-sm bg-slate-7 transition-colors ease-in-out group-hover:bg-slate-4" />
    </div>
    <div className="h-1 w-[50%] rounded-sm bg-slate-5" />
    <div className="flex w-full gap-1">
      <div className="h-1 shrink grow basis-0 rounded-sm bg-slate-5" />
      <div className="h-1 shrink grow basis-0 rounded-sm bg-slate-5" />
    </div>
    <div className="h-1 w-[24%] rounded-sm bg-slate-7 shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)] transition-colors ease-in-out group-hover:bg-[#25AEBA]" />
    <div />
    <div />
    <div className="h-1 w-[24%] rounded-sm bg-slate-7" />
    <div className="flex w-full gap-1">
      <div className="h-1 w-[36%] rounded-sm bg-slate-7" />
      <div className="h-1 w-[24%] rounded-sm bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)]" />
    </div>
  </div>
);

export default IllustrationCodeBlock;
