const IllustrationFooters: React.FC = () => (
  <div className="relative aspect-video translate-y-6 w-[72%] px-6 pt-2 pb-4 rounded-md shadow-sm bg-[#0D0E0E] flex items-center gap-3 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-skew-x-2">
    <div className="w-[30%] flex flex-col gap-1">
      <div className="w-3 h-3 rounded-full bg-[#236380]" />
      <div className="w-[90%] h-2 rounded-sm bg-slate-5 mt-1"/>
    <div className="w-[72%] h-3 rounded-sm bg-slate-5" />
    </div>
    <div className="shrink grow basis-0 flex flex-col gap-1">
    <div className="w-[24%] h-1 mt-1 rounded-sm bg-[#236380]"/>
    <div className="w-[72%] h-2 rounded-sm bg-slate-5 mt-1"/>
      <div className="w-[66%] rounded-sm bg-slate-5 p-1 pb-2">
        <div className="w-[80%] h-1 rounded-sm bg-black/30 group-hover:bg-white/10 transition-colors duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]" />
        </div>
    </div>
  </div>
);

export default IllustrationFooters;