const IllustrationLink: React.FC = () => (
  <div className="relative flex w-full flex-col items-center gap-2">
    <div className="h-2 w-[36%] rounded-xs bg-[#2B2510]" />
    <div className="flex w-[50%] gap-2">
      <div className="h-2 w-[36%] rounded-xs bg-[#2B2510]" />
      <div className="h-2 w-[24%] rounded-xs border border-[#FFD018] bg-[#FFD018] shadow-[0px_0px_9px_4px_rgba(255,208,24,0.10)] transition-all ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:mx-1 group-hover:-translate-y-0.5 group-hover:scale-x-125" />
      <div className="h-2 w-2 rounded-full bg-[#2B2510]" />
    </div>
  </div>
);

export default IllustrationLink;
