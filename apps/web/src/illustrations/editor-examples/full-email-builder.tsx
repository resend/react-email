const IllustrationCodeBlock: React.FC = () => (
  <div className="relative flex aspect-square w-[30%] flex-col gap-2 rounded-md bg-[#260D30] bg-linear-to-b from-transparent via-black/20 to-black/20 p-4 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2">
    <div className="flex w-full gap-1">
      <div className="h-1 w-[24%] rounded-xs bg-[#DB9AFF] shadow-[0px_0px_9px_4px_rgba(219,154,255,0.10)] transition-colors ease-in-out group-hover:bg-purple-8" />
      <div className="h-1 shrink grow basis-0 rounded-xs bg-purple-5" />
    </div>
    <div className="flex w-full gap-1">
      <div className="h-1 shrink grow basis-0 rounded-xs bg-purple-5 transition-colors ease-in-out group-hover:bg-purple-7" />
      <div className="h-1 w-[42%] rounded-xs bg-purple-4" />
    </div>
    <div className="flex w-full gap-1">
      <div className="h-1 w-[36%] rounded-xs bg-purple-7 transition-colors ease-in-out group-hover:bg-purple-4" />
    </div>
    <div className="h-1 w-[50%] rounded-xs bg-purple-5" />
    <div className="h-1 w-[24%] rounded-xs bg-purple-7 shadow-[0px_0px_9px_4px_rgba(219,154,255,0.10)] transition-colors ease-in-out group-hover:bg-[#DB9AFF]" />
    <div />
    <div />
    <div className="h-1 w-[24%] rounded-xs bg-purple-7" />
    <div className="flex w-full gap-1">
      <div className="h-1 w-[36%] rounded-xs bg-purple-7" />
      <div className="h-1 w-[24%] rounded-xs bg-[#DB9AFF] shadow-[0px_0px_9px_4px_rgba(219,154,255,0.10)]" />
    </div>
  </div>
);

export default IllustrationCodeBlock;
