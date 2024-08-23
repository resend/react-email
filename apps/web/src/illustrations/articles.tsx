const IllustrationArticles: React.FC = () => (
  <div className="relative flex aspect-square w-[45%] translate-y-3 flex-col items-center gap-1.5 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/10 px-3 pb-5 pt-2 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <div className="aspect-video w-full rounded-sm bg-slate-4" />
    <div className="h-3 w-[66%] rounded-sm bg-slate-5" />
    <div className="h-3 w-[66%] rounded-sm bg-slate-5" />
    <div className="mt-1 h-3 w-[24%] rounded-sm border border-[#2EBDC9] bg-[#25AEBA] shadow-[0px_0px_15px_5px_rgba(37,174,186,0.30)]" />
  </div>
);

export default IllustrationArticles;
