import { LayoutGroup, motion } from 'framer-motion';
import type { Language } from 'prism-react-renderer';
import * as React from 'react';
import { copyTextToClipboard } from '../utils';
import { tabTransition } from '../utils/constants';
import languageMap from '../utils/language-map';
import { Code } from './code';
import { IconButton } from './icons/icon-button';
import { IconCheck } from './icons/icon-check';
import { IconClipboard } from './icons/icon-clipboard';
import { IconDownload } from './icons/icon-download';
import { Tooltip } from './tooltip';

interface CodeContainerProps {
  markups: MarkupProps[];
  activeLang: string;
  setActiveLang: (lang: string) => void;
}

interface MarkupProps {
  language: Language;
  content: string;
}

export const CodeContainer: React.FC<Readonly<CodeContainerProps>> = ({
  markups,
  activeLang,
  setActiveLang,
}) => {
  const activeMarkup = markups.find(({ language }) => activeLang === language);
  if (!activeMarkup) {
    throw new Error('No markup found for the active language!', {
      cause: {
        activeLang,
        markups,
      },
    });
  }

  return (
    <div
      className="relative max-h-[650px] w-full h-full whitespace-pre rounded-md border border-slate-6 text-sm"
      style={{
        lineHeight: '130%',
        background:
          'linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)',
        boxShadow: 'rgb(0 0 0 / 10%) 0px 5px 30px -5px',
      }}
    >
      <div className="h-9 border-b border-slate-6">
        <div className="flex">
          <LayoutGroup id="code">
            {markups.map(({ language }) => {
              const isCurrentLang = activeLang === language;
              return (
                <motion.button
                  className={`relative px-4 py-[8px] font-sans text-sm font-medium transition duration-200 ease-in-out hover:text-slate-12 ${
                    activeLang !== language ? 'text-slate-11' : 'text-slate-12'
                  }`}
                  key={language}
                  onClick={() => {
                    setActiveLang(language);
                  }}
                >
                  {isCurrentLang ? (
                    <motion.span
                      animate={{ opacity: 1 }}
                      className="absolute bottom-0 left-0 right-0 top-0 bg-slate-4"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      layoutId="code"
                      transition={tabTransition}
                    />
                  ) : null}
                  {languageMap[language]}
                </motion.button>
              );
            })}
          </LayoutGroup>
        </div>
        <CopyToClipboardButton content={activeMarkup.content} />
        <DownloadButton
          content={activeMarkup.content}
          filename={`email.${activeMarkup.language}`}
        />
      </div>
      <div className="h-[calc(100%-2.25rem)]">
        <Code language={activeLang}>{activeMarkup.content}</Code>
      </div>
    </div>
  );
};

interface CopyToClipboardButtonProps {
  content: string;
}

const CopyToClipboardButton = ({ content }: CopyToClipboardButtonProps) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const unsetIsCopiedTimeout = React.useRef<NodeJS.Timeout>(undefined);
  React.useEffect(() => {
    setIsCopied(false);
    clearTimeout(unsetIsCopiedTimeout.current);
    unsetIsCopiedTimeout.current = undefined;
  }, [content]);

  return (
    <Tooltip>
      <Tooltip.Trigger
        asChild
        className="absolute right-2 top-2 hidden md:block"
      >
        <IconButton
          onClick={async () => {
            setIsCopied(true);
            await copyTextToClipboard(content);
            unsetIsCopiedTimeout.current = setTimeout(() => {
              setIsCopied(false);
            }, 3000);
          }}
        >
          {isCopied ? <IconCheck /> : <IconClipboard />}
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content>Copy to Clipboard</Tooltip.Content>
    </Tooltip>
  );
};

interface DownloadButtonProps {
  content: string;
  filename: string;
}

const DownloadButton = ({ content, filename }: DownloadButtonProps) => {
  const generatedUrl = React.useMemo(() => {
    const file = new File([content], filename);
    return URL.createObjectURL(file);
  }, [content, filename]);
  const url = React.useSyncExternalStore(
    () => () => {},
    () => generatedUrl,
    () => undefined,
  );

  return (
    <Tooltip>
      <Tooltip.Trigger
        asChild
        className="text-gray-11 absolute right-8 top-2 hidden md:block"
      >
        <a
          className="text-slate-11 transition duration-200 ease-in-out hover:text-slate-12"
          download={filename}
          href={url}
        >
          <IconDownload />
        </a>
      </Tooltip.Trigger>
      <Tooltip.Content>Download</Tooltip.Content>
    </Tooltip>
  );
};
