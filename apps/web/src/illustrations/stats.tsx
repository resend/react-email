const IllustrationStats: React.FC = () => (
  <div className="relative flex min-w-20 flex-col items-center rounded-sm bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 p-4 text-xl font-black text-[#25AEBA] shadow-sm transition-all duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:[transform:rotateX(25deg)_rotateY(10deg)] group-hover:text-[#2EBDC9]">
    <span className="block font-mono leading-none tabular-nums">0042</span>
    <div className="mt-2 h-2 w-full rounded-sm bg-gradient-to-tl from-slate-6 to-slate-5" />
    <div className="mt-2 h-2 w-[80%] rounded-sm bg-[#25AEBA] shadow-[0_0_.75rem_.375rem_rgba(37,174,186,0.10)]" />
  </div>
);

export default IllustrationStats;
