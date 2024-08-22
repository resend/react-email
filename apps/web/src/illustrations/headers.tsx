const IllustrationHeaders: React.FC = () => (
  <div className="relative flex w-[60%] items-center justify-center gap-2 rounded-full bg-slate-3 py-1 pl-1 pr-2 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-12">
    <div className="flex shrink grow basis-0">
      <div className="h-3 w-3 rounded-full bg-[#236380] transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-translate-y-[.125rem] group-hover:translate-x-1 group-hover:scale-x-125" />
    </div>
    <div className="h-2 w-[10%] rounded-sm bg-slate-5 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-translate-y-[.125rem]" />
    <div className="h-2 w-[10%] rounded-sm bg-slate-5 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-translate-y-[.125rem] group-hover:skew-x-1 group-hover:scale-105" />
    <div className="h-2 w-[10%] rounded-sm bg-slate-5 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-translate-y-[.125rem] group-hover:skew-x-1 group-hover:scale-110" />
    <div className="h-2 w-[10%] rounded-sm bg-[#236380] transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-translate-y-[.125rem] group-hover:translate-x-[.125rem] group-hover:skew-x-1 group-hover:scale-125" />
  </div>
);

export default IllustrationHeaders;
