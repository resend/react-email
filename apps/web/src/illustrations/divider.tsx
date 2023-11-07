const IllustrationDivider: React.FC = () => (
  <div className="relative flex w-[40%] flex-col items-center gap-4 rounded-sm bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 p-3 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-3">
    <div className="h-3 w-[66%] rounded-sm bg-slate-5" />
    <div className="mr-1 flex h-0.5 w-full items-center justify-center gap-1 rounded-sm border border-[#2EBDC9] bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)] transition-all group-hover:scale-x-105" />
    <div className="h-3 w-[66%] rounded-sm bg-slate-5" />
  </div>
);

export default IllustrationDivider;
