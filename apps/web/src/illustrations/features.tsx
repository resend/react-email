const IllustrationFeatures: React.FC = () => (
  <>
    <div className="absolute left-[70%] top-[30%] aspect-video w-[30%] -translate-x-1/2 rotate-6 rounded-md bg-[#0d0d0d] transition-all group-hover:rotate-0 group-hover:bg-[#0F0F10]" />
    <div className="absolute left-[30%] top-[30%] aspect-video w-[30%] -translate-x-1/2 -rotate-6 rounded-md bg-[#0d0d0d] transition-all group-hover:rotate-0 group-hover:bg-[#0F0F10]" />
    <div className="relative flex w-[42%] flex-col gap-2 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 px-2 pb-3 pt-2 shadow-sm transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] group-hover:-skew-x-2 group-hover:bg-[#171717]">
      <div className="h-3 w-3 rounded-full border border-[#2EBDC9] bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)]" />
      <div className="mt-1 h-3 w-[84%] rounded-sm bg-slate-5" />
      <div className="h-3 w-[72%] rounded-sm bg-slate-5" />
      <div className="mt-1 h-3 w-[30%] rounded-sm border border-[#2EBDC9] bg-[#25AEBA] shadow-[0px_0px_9px_4px_rgba(37,174,186,0.10)]" />
    </div>
  </>
);

export default IllustrationFeatures;
