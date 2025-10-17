import { SmileIcon } from 'lucide-react';

const IllustrationTestimonials: React.FC = () => (
  <div className="relative flex min-w-36 items-stretch justify-start gap-3 rounded-md border border-slate-3 bg-[#0F0F10] bg-gradient-to-b from-transparent via-black/20 to-black/20 px-4 py-3 pl-5 shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:skew-x-2">
    <div className="absolute top-0 left-0.5 h-full w-1 border-r-2 border-dashed border-slate-6" />
    <div className="flex min-w-[36%] items-center justify-center rounded-md bg-[#25AEBA] text-black/60 shadow-[0_0_.5625rem_.25rem_rgba(37,174,186,0.10)]">
      <SmileIcon />
    </div>
    <div className="flex flex-1 flex-col gap-1">
      <div className="h-1.5 w-full rounded-sm bg-slate-7" />
      <div className="h-1.5 w-[90%] rounded-sm bg-slate-7" />
      <div className="mt-0.5 h-1 w-[54%] rounded-sm bg-slate-4" />
      <div className="h-1 w-[48%] rounded-sm bg-slate-4" />
    </div>
  </div>
);

export default IllustrationTestimonials;
