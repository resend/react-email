import { ImageIcon } from 'lucide-react';

const IllustrationGallery: React.FC = () => (
  <div className="relative flex h-full w-full items-stretch gap-2 overflow-visible">
    <div className="flex h-max shrink grow basis-0 flex-col items-end gap-2 overflow-visible pb-2">
      <div className="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs">
        <div className="h-full w-full rounded-xs bg-slate-3" />
      </div>
      <div className="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs">
        <div className="flex h-full w-full items-center justify-center rounded-xs bg-slate-3 transition-colors md:group-hover:bg-slate-4">
          <ImageIcon className="opacity-5 transition-opacity md:group-hover:opacity-20" />
        </div>
      </div>
      <div className="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs">
        <div className="h-full w-full rounded-xs bg-slate-3" />
      </div>
    </div>
    <div className="flex h-max shrink grow basis-0 flex-col items-start gap-2 overflow-visible pt-2">
      <div className="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs">
        <div className="h-full w-full rounded-xs bg-slate-3" />
      </div>
      <div className="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs">
        <div className="h-full w-full rounded-xs bg-slate-3" />
      </div>
      <div className="aspect-square w-[30%] rounded-xs bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-2 shadow-xs">
        <div className="h-full w-full rounded-xs bg-slate-3" />
      </div>
    </div>
  </div>
);

export default IllustrationGallery;
