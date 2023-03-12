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
  const [viewMode, setViewMode] = React.useState('desktop');

  React.useEffect(() => {
    const view = searchParams.get('view');

    if (view === 'source' || view === 'desktop') {
      setViewMode(view);
    }
  }, [searchParams]);

  const handleViewMode = (mode: string) => {
    setViewMode(mode);
    router.push(`${pathname}?view=${mode}`);
  };

  return (
    <Shell
      navItems={navItems}
      title={slug}
      markup={markup}
      viewMode={viewMode}
      setViewMode={handleViewMode}
    >
      {viewMode === 'desktop' ? (
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
            />
          </Tooltip.Provider>
        </div>
      )}
    </Shell>
  );
}
