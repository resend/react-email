const IllustrationText: React.FC = () => (
  <div className="relative flex w-[40%] translate-y-3 flex-col gap-2 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 p-2 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-skew-x-6">
    <div className="h-1 w-[84%] rounded-sm bg-slate-5" />
    <div className="flex w-full gap-1">
      <div className="h-1 shrink grow basis-0 rounded-sm bg-slate-5" />
      <div className="h-1 shrink grow basis-0 rounded-sm bg-slate-8" />
    </div>
  </div>
);

export default IllustrationText;
