export default function Illustration() {
  return (
    <div className="relative flex h-full w-[30%] items-center justify-center">
      <div className="absolute top-[36%] right-[-12%] h-12 w-[60%] rotate-2 rounded-lg bg-[#091610] p-1 opacity-100 transition-all duration-200 ease-out group-hover:-translate-y-1.5 group-hover:translate-x-2 group-hover:rotate-12 group-hover:scale-105 group-hover:opacity-80">
        <div className="absolute -bottom-1 left-[60%] h-3 w-3 -translate-x-1/2 rotate-45 rounded-[.125rem] bg-[#091610]" />
        <div className="relative h-full w-full rounded-md bg-linear-to-b from-transparent via-black/20 to-black/20 bg-black/20" />
      </div>
      <div className="absolute top-[30%] left-[-18%] h-12 w-[80%] -rotate-10 rounded-full bg-[#091F15] p-1 opacity-100 transition-all duration-200 ease-out group-hover:-translate-x-2 group-hover:-rotate-15 group-hover:scale-105 group-hover:opacity-80">
        <div className="w-full h-full rounded-full bg-black/20 bg-linear-to-b from-transparent via-black/20 to-black/20" />
        <div className="absolute -bottom-1.5 left-8 h-3 w-3 -translate-x-1/2 rotate-45 rounded-full bg-[#091F15] transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
        <div className="absolute -bottom-3.5 left-9 h-2 w-2 -translate-x-1/2 rotate-45 rounded-full bg-[#091F15] transition-transform duration-200 ease-out group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
      </div>
      <div className="relative w-full transition-transform duration-200 ease-out group-hover:rotate-2 group-hover:scale-110">
        <div className="absolute -bottom-0.75 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[.125rem] bg-[#203C2F]" />
        <div className="relative flex h-7 w-full items-center justify-center gap-1 rounded-sm bg-[#203C2F] p-1.5">
          <div className="h-full grow basis-0 rounded-xs bg-black/35" />
          <div className="h-full w-5 rounded-xs bg-black/35" />
          <div className="h-full w-3 rounded-xs bg-black/35" />
        </div>
      </div>
    </div>
  );
}
