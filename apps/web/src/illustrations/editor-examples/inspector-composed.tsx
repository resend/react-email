const Illustration = () => (
  <div className="relative flex w-[28%] h-fit flex-col gap-2 rounded-md bg-[#2D0D4D] shadow-[inset_0_1px_0_rgba(255,255,255,.2),inset_5px_0_1px_rgba(0,0,0,.25)] bg-linear-to-b from-transparent to-black/10 p-6 pr-3 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2">
    <div className="absolute top-0 left-2 h-full w-1 bg-purple-2" />
    <div className="h-2 w-[90%] rounded-xs bg-purple-5 transition-all duration-200 ease-in-out group-hover:w-full" />
    <div className="h-2 w-[66%] rounded-xs bg-purple-5 transition-all duration-200 ease-in-out group-hover:hidden" />
    <div className="h-2 w-[84%] rounded-xs bg-purple-3 transition-all duration-200 ease-in-out" />
    <div className="h-2 w-[72%] rounded-xs bg-purple-3 transition-all duration-200 ease-in-out" />
    <div className="h-2 w-[72%] rounded-xs bg-purple-3 hidden transition-all duration-200 ease-in-out group-hover:w-[80%] group-hover:block" />
    <div />
  </div>
);

export default Illustration;
