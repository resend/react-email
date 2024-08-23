const IllustrationMarkdown: React.FC = () => (
  <div className="relative flex aspect-square w-[40%] flex-col gap-2 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 p-6 pr-3 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <div className="absolute left-2 top-0 h-full w-1 bg-slate-2" />
    <div className="h-2 w-[90%] rounded-sm bg-slate-5" />
    <div className="h-2 w-[66%] rounded-sm bg-slate-5" />
    <div className="h-2 w-[84%] rounded-sm bg-slate-3" />
    <div className="h-2 w-[72%] rounded-sm bg-slate-3" />
    <div />
    <div className="flex w-[90%] items-center gap-2">
      <div className="h-2 w-[90%] rounded-sm bg-slate-3" />
      <div className="h-3 w-1 rounded-sm bg-slate-6" />
    </div>
  </div>
);

export default IllustrationMarkdown;
