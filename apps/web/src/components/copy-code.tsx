import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ClipboardIcon } from 'lucide-react';
import { useState } from 'react';
import { IconButton } from './icon-button';

export const CopyCode = ({ code }: { code: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <IconButton
      onClick={handleCopy}
      className="p-2.5 flex items-center justify-center rounded-xl shadow-[0px_32px_64px_-16px_transparent,0px_16px_32px_-8px_transparent,0px_8px_16px_-4px_transparent,0px_4px_8px_-2px_transparent,0px_-8px_16px_-1px_transparent,0px_2px_4px_-1px_transparent,0px_0px_0px_1px_transparent,inset_0px_0px_0px_1px_rgba(255,255,255,0.1),inset_0px_1px_0px_rgb(255,255,255,0.15)] duration-200 hover:bg-zinc-900/80 focus:!ring-0"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCopied ? (
          <motion.span
            key="copied"
            className="ml-px"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{
              ease: 'easeOut',
              duration: 0.15,
            }}
          >
            <CheckIcon className="size-4 text-slate-11" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            className="ml-px"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.5 }}
            transition={{
              ease: 'easeOut',
              duration: 0.15,
            }}
          >
            <ClipboardIcon className="size-4 text-slate-11" />
          </motion.span>
        )}
      </AnimatePresence>
    </IconButton>
  );
};
