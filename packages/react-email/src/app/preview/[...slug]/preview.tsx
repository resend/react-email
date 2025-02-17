'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useRef } from 'react';
import { Toaster } from 'sonner';
import type { EmailRenderingResult } from '../../../actions/render-email-by-path';
import { CodeContainer } from '../../../components/code-container';
import { Shell } from '../../../components/shell';
import { Tooltip } from '../../../components/tooltip';
import { useEmailRenderingResult } from '../../../hooks/use-email-rendering-result';
import { useHotreload } from '../../../hooks/use-hot-reload';
import { useIframeColorScheme } from '../../../hooks/use-iframe-color-scheme';
import { useRenderingMetadata } from '../../../hooks/use-rendering-metadata';
import { RenderingError } from './rendering-error';

interface PreviewProps {
  slug: string;
  emailPath: string;
  pathSeparator: string;
  serverRenderingResult: EmailRenderingResult;
}

const Preview = ({
  slug,
  emailPath,
  pathSeparator,
  serverRenderingResult,
}: PreviewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTheme = searchParams.get('theme') ?? 'light';
  const activeView = searchParams.get('view') ?? 'desktop';
  const activeLang = searchParams.get('lang') ?? 'jsx';

  const renderingResult = useEmailRenderingResult(
    emailPath,
    serverRenderingResult,
  );

  const renderedEmailMetadata = useRenderingMetadata(
    emailPath,
    renderingResult,
    serverRenderingResult,
  );

  const iframeRef = useRef<HTMLIFrameElement>(null);
  useIframeColorScheme(iframeRef, activeTheme);

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

  const hasNoErrors = typeof renderedEmailMetadata !== 'undefined';

  const setActiveLang = (lang: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('view', 'source');
    params.set('lang', lang);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Shell
      currentEmailOpenSlug={slug}
      markup={renderedEmailMetadata?.markup}
      pathSeparator={pathSeparator}
    >
      {/* This relative is so that when there is any error the user can still switch between emails */}
      <div className="relative h-full">
        {'error' in renderingResult ? (
          <RenderingError error={renderingResult.error} />
        ) : null}

        {hasNoErrors ? (
          <>
            {activeView === 'desktop' && (
              <iframe
                className="h-[calc(100vh_-_140px)] w-full bg-white lg:h-[calc(100vh_-_70px)]"
                ref={iframeRef}
                srcDoc={renderedEmailMetadata.markup}
                title={slug}
              />
            )}

            {activeView === 'mobile' && (
              <iframe
                className="mx-auto h-[calc(100vh_-_140px)] w-[360px] bg-white lg:h-[calc(100vh_-_70px)]"
                ref={iframeRef}
                srcDoc={renderedEmailMetadata.markup}
                title={slug}
              />
            )}

            {activeView === 'source' && (
              <div className="mx-auto flex max-w-3xl gap-6 p-6">
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
                    setActiveLang={setActiveLang}
                  />
                </Tooltip.Provider>
              </div>
            )}
          </>
        ) : null}

        <Toaster />
      </div>
    </Shell>
  );
};

export default Preview;
