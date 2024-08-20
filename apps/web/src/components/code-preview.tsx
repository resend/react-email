"use client";

import { useState } from "react";

interface CodePreviewProps {
  code: string;
  children: React.ReactNode;
}

export const CodePreview = ({ code, children }: CodePreviewProps) => {
  const [hasCheckIcon, setHasCheckIcon] = useState(false);

  const onCopy = () => {
    void navigator.clipboard.writeText(code);
    setHasCheckIcon(true);

    setTimeout(() => {
      setHasCheckIcon(false);
    }, 1000);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      onCopy();
    }
  };

  return (
    <div className="relative h-full w-full">
      <div
        aria-label="Copy code"
        className="absolute right-4 top-4 cursor-pointer bg-transparent p-2"
        onClick={onCopy}
        onKeyUp={handleKeyUp}
        role="button"
        tabIndex={0}
      >
        <div
          className={`absolute inset-0 transform transition-all duration-300 ${
            hasCheckIcon ? "scale-0 opacity-0" : "scale-100 opacity-100"
          }`}
        />
        <div
          className={`absolute inset-0 transform transition-all duration-300 ${
            hasCheckIcon ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        />
      </div>
      <div className="max-h-[650px] w-full rounded-md bg-zinc-900">
        <div className="inline-block w-full overflow-x-auto p-4 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};
