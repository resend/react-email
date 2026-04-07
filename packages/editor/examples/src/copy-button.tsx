import { Check, Clipboard } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border-0 cursor-pointer transition-colors bg-(--re-hover) text-(--re-text-muted) hover:text-(--re-text)"
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <Check className="size-3.5" />
          Copied
        </>
      ) : (
        <>
          <Clipboard className="size-3.5" />
          Copy
        </>
      )}
    </button>
  );
}
