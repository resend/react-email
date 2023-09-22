// import { LayoutGroup, motion } from 'framer-motion';
import * as React from 'react';

import { PreviewLanguage /* copyTextToClipboard , languageMap*/ } from '../helpers';

import { Code } from './code';
// import { IconButton, IconCheck, IconClipboard, IconDownload } from './icons';
// import { Tooltip } from './tooltip';

interface MarkupProps {
  content: string;
  language: PreviewLanguage;
}

interface CodeContainerProps {
  activeLang: string;
  markups: MarkupProps[];
  setActiveLang: (lang: string) => void;
}

export const CodeContainer: React.FC<Readonly<CodeContainerProps>> = ({
  activeLang,
  markups
  // setActiveLang
}) => {
  const [, /* isCopied */ setIsCopied] = React.useState(false);

  // const renderDownloadIcon = () => {
  //   const value = markups.filter((markup) => markup.language === activeLang);
  //   const file = new File([value[0].content], `email.${value[0].language}`);
  //   const url = URL.createObjectURL(file);

  //   return (
  //     <a
  //       href={url}
  //       download={file.name}
  //       className="transition ease-in-out duration-200 hover:text-dark-bg-text"
  //     >
  //       <IconDownload />
  //     </a>
  //   );
  // };

  // const renderClipboardIcon = () => {
  //   const handleClipboard = async () => {
  //     const activeContent = markups.filter(({ language }) => activeLang === language);
  //     setIsCopied(true);
  //     await copyTextToClipboard(activeContent[0].content);
  //     setTimeout(() => setIsCopied(false), 3000);
  //   };

  //   return (
  //     <IconButton onClick={handleClipboard}>
  //       {isCopied ? <IconCheck /> : <IconClipboard />}
  //     </IconButton>
  //   );
  // };

  React.useEffect(() => {
    setIsCopied(false);
  }, [activeLang]);

  return (
    <>
      {/* <div className="bg-code-bg h-9 border-b border-dark-bg-border">
        <div className="flex">
          <LayoutGroup id="code">
            {markups.map(({ language }) => {
              const isCurrentLang = activeLang === language;
              return (
                <motion.button
                  className={`h-9 border-b border-dark-bg-border relative py-[8px] px-4 text-sm font-medium transition ease-in-out duration-200 hover:text-cyan-11 ${
                    activeLang !== language ? 'text-dark-bg-text' : 'text-cyan-11'
                  }`}
                  onClick={() => setActiveLang(language)}
                  key={language}
                >
                  {isCurrentLang && (
                    <motion.span
                      layoutId="code"
                      className="absolute left-0 right-0 top-0 bottom-0 bg-tab-bg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                  <span className="relative">{languageMap[language]}</span>
                </motion.button>
              );
            })}
          </LayoutGroup>
        </div> */}
      {/* <Tooltip>
        <Tooltip.Trigger asChild className="absolute top-2 right-2 hidden md:block">
          {renderClipboardIcon()}
        </Tooltip.Trigger>
        <Tooltip.Content>Copy to Clipboard</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger asChild className="text-gray-11 absolute top-2 right-8 hidden md:block">
          {renderDownloadIcon()}
        </Tooltip.Trigger>
        <Tooltip.Content>Download</Tooltip.Content>
      </Tooltip> */}
      {/* </div> */}
      {markups.map(({ language, content }) => (
        <div className={`${activeLang !== language && 'hidden'}`} key={language}>
          <Code language={language}>{content.trim()}</Code>
        </div>
      ))}
    </>
  );
};
