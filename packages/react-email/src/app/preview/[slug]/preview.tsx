'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useHotreload } from '../../../hooks/use-hot-reload';
import type { EmailRenderingResult } from '../../../actions/render-email-by-slug';
import { CodeContainer } from '../../../components/code-container';
import { Shell } from '../../../components/shell';
import { Tooltip } from '../../../components/tooltip';
import { useEmails } from '../../../contexts/emails';
import { useRenderingMetadata } from '../../../hooks/use-rendering-metadata';
import { RenderingError } from './rendering-error';

export interface PreviewProps {
  slug: string;
  renderingResult: EmailRenderingResult;
}

const Preview = ({
  slug,
  renderingResult: initialRenderingResult,
}: PreviewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { useEmailRenderingResult } = useEmails();

  const renderingResult = useEmailRenderingResult(slug, initialRenderingResult);

  const renderedEmailMetadata = useRenderingMetadata(
    slug,
    renderingResult,
    initialRenderingResult,
  );

  if (process.env.NEXT_PUBLIC_IS_BUILDING !== 'true') {
    // this will not change on runtime so it doesn't violate
    // the rules of hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotreload((changes) => {
      const changeForThisEmail = changes.find((change) =>
        change.filename.includes(slug),
      );

      if (typeof changeForThisEmail !== 'undefined') {
        if (changeForThisEmail.event === 'unlink') {
          router.push('/');
        }
      }
    });
  }

  const [activeView, setActiveView] = useState('desktop');
  const [activeLang, setActiveLang] = useState('jsx');

  useEffect(() => {
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
      activeView={
        typeof renderedEmailMetadata !== 'undefined' ? activeView : undefined
      }
      currentEmailOpenSlug={slug}
      markup={renderedEmailMetadata?.markup}
      setActiveView={
        typeof renderedEmailMetadata !== 'undefined'
          ? handleViewChange
          : undefined
      }
    >
      {'error' in renderingResult ? (
        <RenderingError error={renderingResult.error} />
      ) : null}

      {/* If this is undefined means that the initial server render of the email had errors */}
      {typeof renderedEmailMetadata !== 'undefined' ? (
        <>
          {activeView === 'desktop' ? (
            <iframe
              className="w-full h-[calc(100vh_-_140px)]"
              srcDoc={renderedEmailMetadata.markup}
              title={slug}
            />
          ) : (
            <div className="flex gap-6 mx-auto p-6 max-w-3xl">
              <Tooltip.Provider>
                <CodeContainer
                  activeLang={activeLang}
                  markups={[
                    {
                      language: 'jsx',
                      content: renderedEmailMetadata.reactMarkup,
                    },
                    {
                      language: 'markup',
                      content: renderedEmailMetadata.markup,
                    },
                    {
                      language: 'markdown',
                      content: renderedEmailMetadata.plainText,
                    },
                  ]}
                  setActiveLang={handleLangChange}
                />
              </Tooltip.Provider>
            </div>
          )}
        </>
      ) : null}
    </Shell>
  );
};

export default Preview;
