import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ClipboardIcon } from 'lucide-react';
import { useState } from 'react';
import { IconButton } from './icon-button';

export const CopyCode = ({
  code,
  className,
}: {
  code: string;
  className?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <IconButton
      disabled={isCopied}
      onClick={handleCopy}
      className={classNames(
        'p-2.5 flex items-center justify-center rounded-xl duration-200 focus:!ring-0',
        'shadow-[0px_32px_64px_-16px_transparent,0px_16px_32px_-8px_transparent,0px_8px_16px_-4px_transparent,0px_4px_8px_-2px_transparent,0px_-8px_16px_-1px_transparent,0px_2px_4px_-1px_transparent,0px_0px_0px_1px_transparent,inset_0px_0px_0px_1px_rgba(255,255,255,0.1),inset_0px_1px_0px_rgb(255,255,255,0.15)] enabled:hover:bg-zinc-900/80',
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {isCopied ? (
          <motion.span
            key="copied"
            className="ml-px"
            initial={{ scale: 0 }}
            animate={{ scale: 1, filter: 'blur(0)' }}
            exit={{ scale: 0, filter: 'blur(2px)' }}
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.3,
            }}
          >
            <CheckIcon className="size-4 text-slate-12" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            className="ml-px"
            initial={{ scale: 0 }}
            animate={{ scale: 1, filter: 'blur(0)' }}
            exit={{ scale: 0, filter: 'blur(2px)' }}
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.3,
            }}
          >
            <ClipboardIcon className="size-4 text-slate-11 transition-colors" />
          </motion.span>
        )}
      </AnimatePresence>
    </IconButton>
  );
};
