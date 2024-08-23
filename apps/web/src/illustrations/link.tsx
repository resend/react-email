const IllustrationLink: React.FC = () => (
  <div className="relative flex w-full flex-col items-center gap-2">
    <div className="h-2 w-[36%] rounded-sm bg-slate-7" />
    <div className="flex w-[50%] gap-2">
      <div className="h-2 w-[36%] rounded-sm bg-slate-7" />
      <div className="h-2 w-[24%] rounded-sm border border-[#2EBDC9] bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)] transition-all ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:mx-1 group-hover:scale-x-125" />
    </div>
    <div className="flex w-[50%] gap-2">
      <div className="h-2 w-[80%] rounded-sm bg-slate-7" />
      <div className="h-2 w-2 rounded-full bg-slate-7" />
    </div>
  </div>
);

export default IllustrationLink;
