const IllustrationHeaders: React.FC = () => (
  <div className="w-[60%] shadow-sm py-1 pl-1 pr-2 bg-[#0D0E0E] flex gap-2 items-center justify-center relative rounded-full group-hover:skew-x-12 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]">
    <div className="flex shrink grow basis-0">
      <div className="w-3 h-3 rounded-full bg-[#236380] group-hover:scale-x-125 group-hover:translate-x-1 group-hover:-translate-y-[.125rem] transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]"/>
    </div>
    <div className="w-[10%] h-2 rounded-sm bg-slate-5 group-hover:-translate-y-[.125rem] transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]" />
    <div className="w-[10%] h-2 rounded-sm bg-slate-5 group-hover:scale-105 group-hover:-translate-y-[.125rem] group-hover:skew-x-1 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]" />
    <div className="w-[10%] h-2 rounded-sm bg-slate-5 group-hover:scale-110 group-hover:-translate-y-[.125rem] group-hover:skew-x-1 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]" />
    <div className="w-[10%] h-2 rounded-sm bg-[#236380] group-hover:scale-125 group-hover:-translate-y-[.125rem] group-hover:skew-x-1 group-hover:translate-x-[.125rem] transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]" />
  </div>
);

export default IllustrationHeaders;