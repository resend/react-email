const IllustrationArticles: React.FC = () => (
  <div className="relative flex aspect-square w-[40%] translate-y-3 flex-col items-center gap-2 rounded-md bg-[#0D0E0E] px-2 pb-4 pt-2 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <div className="aspect-video w-full rounded-sm bg-slate-4" />
    <div className="mt-1 h-1 w-[24%] rounded-sm bg-[#236380]" />
    <div className="h-2 w-[72%] rounded-sm bg-slate-5" />
    <div className="h-3 w-[66%] rounded-sm bg-slate-5" />
    <div className="mt-1 h-2 w-[24%] rounded-sm bg-[#236380]" />
  </div>
);

export default IllustrationArticles;
