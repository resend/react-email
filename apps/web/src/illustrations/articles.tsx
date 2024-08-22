

const IllustrationArticles: React.FC = () => (
  <div className="relative aspect-square translate-y-3 w-[40%] px-2 pt-2 pb-4 rounded-md shadow-sm bg-[#0D0E0E] flex items-center flex-col gap-2 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:skew-x-2">
    <div className="w-full bg-slate-4 aspect-video rounded-sm"/>
    <div className="w-[24%] h-1 mt-1 rounded-sm bg-[#236380]"/>
    <div className="w-[72%] h-2 rounded-sm bg-slate-5"/>
    <div className="w-[66%] h-3 rounded-sm bg-slate-5" />
    <div className="w-[24%] h-2 mt-1 rounded-sm bg-[#236380]"/>
  </div>
);

export default IllustrationArticles;