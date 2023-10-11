'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { CodeContainer } from '../../../components/code-container';
import { Shell } from '../../../components/shell';
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

  const [currentWidth, setCurrentWidth] = React.useState<number | undefined>(
    undefined,
  );
  const el = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    // Define the callback function
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (let entry of entries) {
        setCurrentWidth(entry.contentRect.width);
      }
    };

    // Create a ResizeObserver instance and pass in the callback
    const observer = new ResizeObserver(handleResize);

    const ref = el.current;
    // Observe the div
    if (ref) {
      observer.observe(ref);
    }

    // Clean up: unobserve the div when the component is unmounted
    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, []);

  return (
    <Shell
      navItems={navItems}
      title={slug}
      markup={markup}
      activeView={activeView}
      setActiveView={handleViewChange}
    >
      {activeView === 'desktop' ? (
        <div className="relative p-8">
          <div className="absolute bottom-0 right-0 text-gray-100">
            {currentWidth && `${currentWidth}px`}
          </div>
          <div className="overflow-auto resize-x" ref={el}>
            <iframe srcDoc={markup} className="w-full h-[calc(100vh_-_70px)]" />
          </div>
        </div>
      ) : (
        <div className="flex max-w-3xl gap-6 p-6 mx-auto">
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
