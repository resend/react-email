export default function Illustration() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative flex h-20 w-30 items-center justify-center gap-[12%] rounded-md bg-[#260D30] p-2 px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.2)] transition-[transform,gap] duration-150 ease-[cubic-bezier(0.42,0,0.58,1.8)] motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:gap-[8%] group-hover:rotate-2 group-hover:gap-0">
        <div
          className="relative z-10 aspect-square w-[40%] shrink-0 rounded-l-sm bg-[#DB9AFF] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]
            after:absolute after:right-0 after:top-1/2 after:z-10 after:aspect-square after:w-[32%] after:translate-x-1/2 after:-translate-y-1/2
            after:rounded-full after:bg-[#DB9AFF] after:shadow-[inset_-.125rem_0_.0625rem_-.0625rem_rgba(255,255,255,.4)] after:content-['']"
        >
          <div className="absolute left-1/2 top-0 z-20 aspect-square w-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DB9AFF] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
        </div>
        <div
          className="relative z-0 aspect-square w-[40%] shrink-0 rounded-r-sm bg-[#100613] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]
            before:absolute before:left-0 before:top-1/2 before:z-10 before:aspect-square before:w-[32%] before:-translate-x-1/2 before:-translate-y-1/2
            before:rounded-full before:bg-[#260D30] before:content-['']
            after:absolute after:right-0 after:top-1/2 after:z-10 after:aspect-square after:w-[36%] after:translate-x-1/2 after:-translate-y-1/2
            after:rounded-full after:bg-[#260D30] after:content-['']"
        >
          <div className="absolute left-1/2 top-0 z-20 aspect-square w-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#100613] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
          <div className="absolute bottom-0 left-1/2 z-20 aspect-square w-[36%] -translate-x-1/2 translate-y-1/2 rounded-full bg-[#260D30]" />
        </div>
      </div>
    </div>
  );
}
