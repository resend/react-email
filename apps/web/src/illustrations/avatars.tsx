import { UserRoundIcon } from 'lucide-react';

const IllustrationAvatars: React.FC = () => (
  <div className="relative flex items-center">
    <div className="relative size-9 rounded-full border-4 border-black shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:-translate-x-2 md:group-hover:-rotate-12">
      <div className="absolute inset-0 rounded-full border border-[#2EBDC9] bg-[#25AEBA] text-lg text-transparent">
        <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full pt-2">
          <UserRoundIcon className="fill-black/50" />
        </span>
      </div>
    </div>
    <div className="relative -ml-2 size-9 rounded-full border-4 border-black shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:-translate-x-1 md:group-hover:-translate-y-1">
      <div className="absolute inset-0 rounded-full border border-[#2EBDC9] bg-[#25AEBA] text-lg text-transparent">
        <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full pt-2">
          <UserRoundIcon className="fill-black/50" />
        </span>
      </div>
    </div>
    <div className="relative -ml-2 size-9 rounded-full border-4 border-black shadow-sm transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:rotate-6">
      <div className="absolute inset-0 rounded-full border border-[#2EBDC9] bg-[#25AEBA] text-lg text-transparent">
        <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full pt-2">
          <UserRoundIcon className="fill-black/50" />
        </span>
      </div>
    </div>
  </div>
);

export default IllustrationAvatars;
