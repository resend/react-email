const IllustrationFeatures: React.FC = () => (
  <>
    <div className="absolute left-[70%] top-[30%] aspect-video w-[30%] -translate-x-1/2 rotate-6 rounded-md bg-slate-4 transition-all group-hover:rotate-0 group-hover:bg-slate-3" />
    <div className="absolute left-[30%] top-[30%] aspect-video w-[30%] -translate-x-1/2 -rotate-6 rounded-md bg-slate-4 transition-all group-hover:rotate-0 group-hover:bg-slate-3" />
    <div className="relative flex w-[42%] flex-col gap-2 rounded-md bg-[#0D0E0E] px-2 pb-3 pt-2 shadow-sm transition-all duration-300 ease-[cubic-bezier(.36,.66,.6,1)] group-hover:-skew-x-2 group-hover:bg-[#212222]">
      <div className="h-3 w-3 rounded-full bg-[#236380]" />
      <div className="mt-1 h-2 w-[84%] rounded-sm bg-slate-5" />
      <div className="h-3 w-[72%] rounded-sm bg-slate-5" />
      <div className="mt-1 h-2 w-[30%] rounded-sm bg-[#236380]" />
    </div>
  </>
);

export default IllustrationFeatures;
