import { ImageIcon } from 'lucide-react';

const IllustrationImage: React.FC = () => (
  <div className="flex aspect-square w-[30%] items-center justify-center rounded-md bg-slate-4 transition-colors group-hover:bg-slate-5">
    <ImageIcon className="opacity-5 transition-opacity group-hover:opacity-20" />
  </div>
);

export default IllustrationImage;
