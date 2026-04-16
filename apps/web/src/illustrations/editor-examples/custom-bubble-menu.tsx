export default function Illustration() {
  return (
    <div className="relative flex h-full w-[30%] items-center justify-center">
      <div className="relative h-12 w-[80%] rotate-2 rounded-lg bg-[#3D3517] p-1 transition-all duration-200 ease-out group-hover:-translate-y-1.5 group-hover:translate-x-2 group-hover:rotate-12 group-hover:scale-105">
        <div className="absolute -bottom-1 left-[60%] h-3 w-3 -translate-x-1/2 rotate-45 rounded-[.125rem] bg-[#3D3517]" />
        <div className="relative h-full w-full rounded-md bg-black/30" />
        <div className="absolute top-[.1875rem] left-[.1875rem] bg-[#3D3517] rounded-br-[.125rem] w-7.5 h-4" />
        <div className="absolute top-[-.5rem] left-[-.5rem] -rotate-10 group-hover:rotate-0 bg-[#ffca16] rounded-[.125rem] group-hover:top-1 shadow-[0px_0px_9px_4px_rgba(186,156,37,.18)] group-hover:left-1 w-7.5 h-4 transition-all duration-200 ease-out" />
      </div>
    </div>
  );
}
