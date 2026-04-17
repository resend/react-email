const Illustration = () => (
  <div className="relative flex h-full w-full items-center justify-center transition-all duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:-translate-y-3 group-hover:skew-x-8">
    <div className="relative flex h-3.5 w-fit items-center gap-0.5 p-0.5">
      <div className="relative h-full w-[.75rem] rounded-xs bg-green-8 shadow-[0_0_1rem_#25BA72/20]">
        <div className="absolute left-1/2 top-[calc(100%+1rem)] w-20 -translate-x-1/2 -rotate-5 opacity-0 transition-all ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:rotate-0 group-hover:scale-125 group-hover:opacity-100">
          <div className="absolute left-1/2 -top-0.75 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[.125rem] bg-[#203C2F]" />
          <div className="relative flex h-4 w-full items-center justify-center gap-0.5 rounded-sm bg-[#203C2F] p-1">
            <div className="h-full shrink grow basis-0 rounded-xs bg-green-5" />
            <div className="h-full w-2 rounded-xs bg-green-7" />
            <div className="h-full w-2 rounded-xs bg-green-8" />
          </div>
        </div>
      </div>
      <div className="h-full w-10 rounded-xs bg-green-5" />
      <div className="pointer-events-none absolute left-[-.25rem] top-1/2 h-full w-full -translate-y-1/2 skew-x-170 overflow-hidden border-l-2 border-[#25BA72] bg-linear-to-r from-[#25BA72]/20 via-[#25BA72]/10 to-transparent">
        <div className="absolute left-0 top-0 h-full w-full animate-[shineTranslate_6s_cubic-bezier(.36,.66,.6,1)infinite.504s] bg-[linear-gradient(114deg,#25BA7200,#25BA7214_24%,#25BA7233_42%,#25BA7233_60%,#25BA7214_78%,#25BA7200)] blur-[0.375rem] will-change-[transform,filter]" />
      </div>
    </div>
  </div>
);

export default Illustration;
