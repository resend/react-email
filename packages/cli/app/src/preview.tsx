'use client';

import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { CodeContainer } from './components/code-container';
import { Shell } from './components/shell';
import { Tooltip } from './components/tooltip';

interface PreviewProps {
  html: string;
  jsx: string;
  plainText: string;
  templateNames: string[];
  title: string;
}

export const Preview = ({ html, jsx, plainText, templateNames, title }: PreviewProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeView, setActiveView] = React.useState('desktop');
  const [activeLang, setActiveLang] = React.useState('jsx');

  React.useEffect(() => {
    document.title = `JSX email • ${title}`;

    const view = searchParams.get('view');
    const lang = searchParams.get('lang');

    if (view === 'source' || view === 'desktop') setActiveView(view);
    if (lang === 'jsx' || lang === 'markup' || lang === 'markdown') setActiveLang(lang);
  }, [searchParams]);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    navigate(`${pathname}?view=${view}`);
  };

  const handleLangChange = (lang: string) => {
    setActiveLang(lang);
    navigate(`${pathname}?view=source&lang=${lang}`);
  };

  return (
    <Shell
      templateNames={templateNames}
      title={title}
      html={html}
      activeView={activeView}
      setActiveView={handleViewChange}
    >
      {activeView === 'desktop' ? (
        <iframe srcDoc={html} className="w-full h-[calc(100vh_-_140px)]" />
      ) : (
        <div className="flex gap-6 mx-auto p-6 max-w-5xl">
          <Tooltip.Provider>
            <CodeContainer
              markups={[
                { content: jsx, language: 'jsx' },
                { content: html, language: 'html' },
                { content: plainText, language: 'plainText' }
              ]}
              activeLang={activeLang}
              setActiveLang={handleLangChange}
            />
          </Tooltip.Provider>
        </div>
      )}
    </Shell>
  );
};
