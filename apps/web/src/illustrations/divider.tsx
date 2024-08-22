const IllustrationDivider: React.FC = () => (
  <div className="relative flex w-[40%] flex-col items-center gap-5 rounded-sm bg-slate-3 p-3 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-3">
    <div className="h-3 w-[66%] rounded-sm bg-slate-5" />
    <div className="mr-1 flex h-1 w-full items-center justify-center gap-1 rounded-sm bg-[#236380] transition-all group-hover:scale-x-105">
      <div className="h-3 w-1 -skew-x-12 rounded-sm bg-[#236380]" />
      <div className="h-3 w-1 -skew-x-12 rounded-sm bg-[#236380]" />
    </div>
    <div className="h-3 w-[66%] rounded-sm bg-slate-5" />
  </div>
);

export default IllustrationDivider;
