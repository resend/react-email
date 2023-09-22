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

  React.useEffect(() => {
    document.title = `JSX email • ${title}`;

    const view = searchParams.get('view');

    if (view && ['desktop', 'html', 'jsx', 'plainText'].includes(view)) setActiveView(view);
  }, [searchParams]);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    navigate(`${pathname}?view=${view}`);
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
        <iframe srcDoc={html} className="w-full h-[calc(100vh_-_70px)]" />
      ) : (
        <div>
          <Tooltip.Provider>
            <CodeContainer
              raws={[
                { content: jsx, language: 'jsx' },
                { content: html, language: 'html' },
                { content: plainText, language: 'plain' }
              ]}
              activeView={activeView}
              setActiveView={handleViewChange}
            />
          </Tooltip.Provider>
        </div>
      )}
    </Shell>
  );
};
