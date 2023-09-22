import classNames from 'classnames';
import * as React from 'react';

import { PreviewLanguage, copyTextToClipboard } from '../helpers';

import { Code } from './code';
import { IconButton, IconCheck, IconClipboard, IconDownload } from './icons';
import { Tooltip } from './tooltip';

interface RawProps {
  content: string;
  language: PreviewLanguage;
}

interface CodeContainerProps {
  activeView: string;
  raws: RawProps[];
  setActiveView: (lang: string) => void;
}

export const CodeContainer: React.FC<Readonly<CodeContainerProps>> = ({
  activeView,
  raws
  // setActiveLang
}) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const renderDownloadIcon = () => {
    const value = raws.find((raw) => raw.language === activeView);
    const file = new File([value!.content], `email.${value!.language}`);
    const url = URL.createObjectURL(file);

    return (
      <a
        href={url}
        download={file.name}
        className="transition ease-in-out duration-200 hover:text-dark-bg-text"
      >
        <IconDownload />
      </a>
    );
  };

  const renderClipboardIcon = () => {
    const handleClipboard = async () => {
      const activeContent = raws.filter(({ language }) => activeView === language);
      setIsCopied(true);
      await copyTextToClipboard(activeContent[0].content);
      setTimeout(() => setIsCopied(false), 3000);
    };

    return (
      <IconButton onClick={handleClipboard}>
        {isCopied ? <IconCheck /> : <IconClipboard />}
      </IconButton>
    );
  };

  React.useEffect(() => {
    setIsCopied(false);
  }, [activeView]);

  return (
    <>
      <Tooltip>
        <Tooltip.Trigger asChild className="absolute top-[20px] right-[20px] hidden md:block">
          {renderClipboardIcon()}
        </Tooltip.Trigger>
        <Tooltip.Content style={{ color: '#777' }}>Copy to Clipboard</Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger
          asChild
          className="text-gray-11 absolute top-[20px] right-[50px] hidden md:block"
        >
          {renderDownloadIcon()}
        </Tooltip.Trigger>
        <Tooltip.Content style={{ color: '#777' }}>Download</Tooltip.Content>
      </Tooltip>
      {raws.map(({ language, content }) => (
        <div
          className={classNames({
            hidden: activeView !== language,
            'text-base text-[#ccc] p-4 pr-20 whitespace-pre': activeView === 'plain',
            'text-xs': activeView !== 'plain'
          })}
          key={language}
        >
          <Code language={language}>{content.trim()}</Code>
        </div>
      ))}
    </>
  );
};
