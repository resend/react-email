const IllustrationFooters: React.FC = () => (
  <div className="relative flex aspect-video w-[72%] translate-y-6 items-center gap-5 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 px-6 pb-4 pt-2 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-skew-x-2">
    <div className="flex w-[30%] flex-col gap-1">
      <div className="h-3 w-3 rounded-full border border-[#2EBDC9] bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)]" />
      <div className="mt-1 h-2 w-[90%] rounded-sm bg-slate-5" />
      <div className="h-3 w-[72%] rounded-sm bg-slate-5" />
    </div>
    <div className="flex shrink grow basis-0 flex-col gap-1">
      <div className="mt-1 h-2 w-[24%] rounded-sm border border-[#2EBDC9] bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)]" />
      <div className="mt-1 h-2 w-[72%] rounded-sm bg-slate-5" />
      <div className="w-[66%] rounded-sm bg-slate-5 p-1 pb-2">
        <div className="h-1 w-[80%] rounded-sm bg-black/30 transition-colors duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:bg-white/10" />
      </div>
    </div>
  </div>
);

export default IllustrationFooters;
