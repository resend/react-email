'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useHotreload } from '../../../hooks/use-hot-reload';
import type {
  EmailRenderingResult,
  RenderedEmailMetadata,
} from '../../../actions/render-email-by-slug';
import { renderEmailBySlug } from '../../../actions/render-email-by-slug';
import { CodeContainer } from '../../../components/code-container';
import { Shell } from '../../../components/shell';
import { Tooltip } from '../../../components/tooltip';
import { RenderingError } from './rendering-error';

export interface PreviewProps {
  slug: string;
  renderingResult: EmailRenderingResult;
}

const useLastEmailRenderingResultIfCurrentErrors = (
  renderingResult: EmailRenderingResult,
): RenderedEmailMetadata | undefined => {
  const [lastRenderMetadata, setLastRenderMetadata] = useState<
    RenderedEmailMetadata | undefined
  >('error' in renderingResult ? undefined : renderingResult);

  useEffect(() => {
    if ('markup' in renderingResult) {
      setLastRenderMetadata(renderingResult);
    }
  }, [renderingResult]);

  return lastRenderMetadata;
};

const Preview = ({
  slug,
  renderingResult: initialRenderingResult,
}: PreviewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [renderingResult, setRenderingResult] = useState<EmailRenderingResult>({
    ...initialRenderingResult,
  });

  const renderedEmailMetadata =
    useLastEmailRenderingResultIfCurrentErrors(renderingResult);

  if (process.env.NEXT_PUBLIC_DISABLE_HOT_RELOADING !== 'true') {
    // this will not change on runtime so it doesn't violate
    // the rules of hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotreload(async (changes) => {
      const changeForThisEmail = changes.find((change) =>
        change.filename.includes(slug),
      );

      if (typeof changeForThisEmail !== 'undefined') {
        if (changeForThisEmail.event === 'unlink') {
          router.push('/');
        } else {
          const result = await renderEmailBySlug(slug);
          setRenderingResult(result);
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
              // @ts-expect-error For some reason the title prop is not included with the iframe
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
