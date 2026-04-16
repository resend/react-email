const IllustrationText: React.FC = () => (
  <div className="group-hover:-skew-x-6 relative flex w-[40%] translate-y-3 flex-col gap-2 rounded-md bg-[#1E1A0C] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]">
    <div className="h-4 w-[84%] ml-auto rounded-xs bg-black/40" />
    <div className="flex w-full gap-2">
      <div className="h-4 shrink grow basis-0 rounded-xs bg-black/40 transition-all duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:bg-black/60" />
      <div className="h-4 w-[30%] rounded-xs border border-dashed border-[#FFD019] transition-all duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:w-[60%]" />
    </div>
  </div>
);

export default IllustrationText;
