'use client';

import { Shell } from '../../../components/shell';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CodeContainer } from '../../../components/code-container';
import React from 'react';
import { Tooltip } from '../../../components/tooltip';

export default function Preview({
  navItems,
  slug,
  markup,
  reactMarkup,
  plainText,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = React.useState('desktop');
  const [activeLang, setActiveLang] = React.useState('jsx');

  React.useEffect(() => {
    const view = searchParams.get('view');
    const lang = searchParams.get('lang');

    if (view === 'source' || view === 'desktop') {
      setActiveView(view);
    }

    if (lang === 'jsx' || lang === 'markup' || lang === 'markdown') {
      setActiveLang(lang);
    }
  }, [searchParams]);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    router.push(`${pathname}?view=${view}`);
  };

  const handleLangChange = (lang: string) => {
    setActiveLang(lang);
    router.push(`${pathname}?view=source&lang=${lang}`);
  };

  return (
    <Shell
      navItems={navItems}
      title={slug}
      markup={markup}
      activeView={activeView}
      setActiveView={handleViewChange}
    >
      {activeView === 'desktop' ? (
        <iframe srcDoc={markup} className="w-full h-[calc(100vh_-_70px)]" />
      ) : (
        <div className="flex gap-6 mx-auto p-6 max-w-3xl">
          <Tooltip.Provider>
            <CodeContainer
              markups={[
                { language: 'jsx', content: reactMarkup },
                { language: 'markup', content: markup },
                { language: 'markdown', content: plainText },
              ]}
              activeLang={activeLang}
              setActiveLang={handleLangChange}
            />
          </Tooltip.Provider>
        </div>
      )}
    </Shell>
  );
}
