import { Language } from 'prism-react-renderer';
import { IconButton } from './icon-button';
import { IconClipboard } from './icon-clipboard';
import { IconDownload } from './icon-download';
import { IconCheck } from './icon-check';
import { copyTextToClipboard } from '../utils';
import languageMap from '../utils/language-map';
import { Tooltip } from './tooltip';
import { Code } from './code';
import * as React from 'react';

interface CodeContainerProps {
  markups: MarkupProps[];
}

interface MarkupProps {
  language: Language;
  content: string;
}

export const CodeContainer: React.FC<Readonly<CodeContainerProps>> = ({
  markups,
}) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(markups[0].language);
  let file = null;
  let url = null;

  const renderDownloadIcon = () => {
    let value = markups.filter((markup) => markup.language === activeTab);
    file = new File([value[0].content], `email.${value[0].language}`);
    url = URL.createObjectURL(file);

    return (
      <a href={url} download={file.name}>
        <IconDownload />
      </a>
    );
  };

  const renderClipboardIcon = () => {
    const handleClipboard = async () => {
      const activeContent = markups.filter(({ language }) => {
        return activeTab === language;
      });
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
  }, [activeTab]);

  return (
    <pre
      className={
        'border-slate-6 relative w-full items-center overflow-auto whitespace-pre rounded-md border text-sm backdrop-blur-md'
      }
      style={{
        lineHeight: '130%',
        background:
          'linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)',
        boxShadow: 'rgb(0 0 0 / 10%) 0px 5px 30px -5px',
      }}
    >
      <div className="h-9 border-b border-slate-6">
        <div className="py-[10px] px-4 text-xs flex gap-8">
          {markups.map(({ language }) => {
            return (
              <div key={language}>
                <button
                  className={`${activeTab !== language && 'opacity-25'}`}
                  onClick={() => setActiveTab(language)}
                >
                  {languageMap[language]}
                </button>
              </div>
            );
          })}
        </div>
        <Tooltip>
          <Tooltip.Trigger className="absolute top-2 right-2 hidden md:block">
            {renderClipboardIcon()}
          </Tooltip.Trigger>
          <Tooltip.Content>Copy to Clipboard</Tooltip.Content>
        </Tooltip>
        <Tooltip>
          <Tooltip.Trigger className="text-gray-11 absolute top-2 right-8 hidden md:block">
            {renderDownloadIcon()}
          </Tooltip.Trigger>
          <Tooltip.Content>Download</Tooltip.Content>
        </Tooltip>
      </div>
      {markups.map(({ language, content }) => {
        return (
          <div
            className={`${activeTab !== language && 'hidden'}`}
            key={language}
          >
            <Code language={language}>{content}</Code>
          </div>
        );
      })}
    </pre>
  );
};
