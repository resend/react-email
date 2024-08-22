const IllustrationCodeBlock: React.FC = () => (
  <div className="relative aspect-square w-[40%] p-4 rounded-md shadow-sm bg-[#0D0E0E] flex flex-col gap-2 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <div className="w-full flex gap-1">
      <div className="w-[24%] h-1 rounded-sm bg-[#236380] group-hover:bg-slate-8 transition-colors ease-in-out"/>
      <div className="shrink grow basis-0 h-1 rounded-sm bg-slate-5"/>
    </div>
    <div className="w-full flex gap-1">
      <div className="shrink grow basis-0 h-1 rounded-sm bg-slate-5 group-hover:bg-slate-7 transition-colors ease-in-out"/>
      <div className="w-[42%] h-1 rounded-sm bg-slate-4"/>
    </div>
    <div className="w-full flex gap-1">
      <div className="w-[36%] h-1 rounded-sm bg-slate-7 group-hover:bg-slate-4 transition-colors ease-in-out"/>
    </div>
    <div className="w-[50%] h-1 rounded-sm bg-slate-5"/>
    <div className="w-full flex gap-1">
      <div className="shrink grow basis-0 h-1 rounded-sm bg-slate-5"/>
      <div className="shrink grow basis-0 h-1 rounded-sm bg-slate-5" />
    </div>
    <div className="w-[24%] h-1 rounded-sm bg-slate-7 group-hover:bg-[#236380] transition-colors ease-in-out" />
    <div />
    <div />
    <div className="w-[24%] h-1 rounded-sm bg-slate-7" />
    <div className="w-full flex gap-1">
      <div className="w-[36%] h-1 rounded-sm bg-slate-7" />
      <div className="w-[24%] h-1 rounded-sm bg-[#236380]"/>
    </div>
  </div>
);

export default IllustrationCodeBlock;