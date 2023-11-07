const IllustrationHeading: React.FC = () => (
  <div className="relative flex w-[40%] flex-col items-center gap-2 rounded-md bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 px-2 pb-4 pt-2 shadow-sm">
    <div className="h-2 w-[84%] rounded-sm bg-slate-6 transition-transform group-hover:scale-x-105" />
    <div className="h-2 w-[72%] rounded-sm bg-slate-5 transition-transform group-hover:scale-x-105" />
    <div className="h-2 w-[60%] rounded-sm bg-slate-4 transition-transform group-hover:scale-x-105" />
    <div className="h-2 w-[42%] rounded-sm bg-slate-3 transition-transform group-hover:scale-x-105" />
  </div>
);

export default IllustrationHeading;
