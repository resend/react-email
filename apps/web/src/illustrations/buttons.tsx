import { MousePointer2Icon } from "lucide-react";

const IllustrationButtons: React.FC = () => (
  <div className="w-[24%] h-6 p-1 rounded-sm shadow-sm bg-[#236380] flex items-center transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] justify-center relative group-hover:rotate-6">
    <div className="w-[80%] h-2 rounded-sm bg-black/30" />
    <MousePointer2Icon className="absolute -bottom-4 left-[80%]" fill="currentColor" stroke="currentColor"/>
  </div>
);

export default IllustrationButtons;