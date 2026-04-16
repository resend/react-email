const IllustrationCodeBlock: React.FC = () => (
  <div className="relative flex items-center justify-center w-full h-full">
    <div className="relative w-[40%] h-10 p-2 rounded-md bg-[#2D0D4D] flex gap-2 items-center justify-center transition-all duration-200 ease-in-out group-hover:translate-y-2">
      <div className="aspect-square shrink-0 basis-0 grow rounded-sm bg-[#DB9AFF] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 ease-in-out group-hover:-translate-y-4" />
      <div className="aspect-square shrink-0 basis-0 grow rounded-sm bg-[#DB9AFF]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 ease-in-out group-hover:-translate-y-3" />
      <div className="aspect-square shrink-0 basis-0 grow rounded-sm bg-[#DB9AFF]/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 ease-in-out group-hover:-translate-y-2" />
      <div className="aspect-square shrink-0 basis-0 grow rounded-sm bg-[#DB9AFF]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-200 ease-in-out group-hover:-translate-y-1" />
    </div>
  </div>
);

export default IllustrationCodeBlock;
