'use client';
import { useRouter } from 'next/navigation';
import { createContext } from 'react';
import type {
  EmailRenderingResult,
  RenderedEmailMetadata,
} from '../actions/render-email-by-path';
import { isBuilding } from '../app/env';
import { useEmailRenderingResult } from '../hooks/use-email-rendering-result';
import { useHotreload } from '../hooks/use-hot-reload';
import { useRenderingMetadata } from '../hooks/use-rendering-metadata';

export const PreviewContext = createContext<
  | {
      renderedEmailMetadata: RenderedEmailMetadata | undefined;
      renderingResult: EmailRenderingResult;

      emailSlug: string;
      emailPath: string;
    }
  | undefined
>(undefined);

interface PreviewProvider {
  emailSlug: string;
  emailPath: string;

  serverRenderingResult: EmailRenderingResult;

  children: React.ReactNode;
}

export const PreviewProvider = ({
  emailSlug,
  emailPath,
  serverRenderingResult,
  children,
}: PreviewProvider) => {
  const router = useRouter();

  const renderingResult = useEmailRenderingResult(
    emailPath,
    serverRenderingResult,
  );

  const renderedEmailMetadata = useRenderingMetadata(
    emailPath,
    renderingResult,
    serverRenderingResult,
  );

  if (!isBuilding) {
    // this will not change on runtime so it doesn't violate
    // the rules of hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotreload((changes) => {
      const changeForThisEmail = changes.find((change) =>
        change.filename.includes(emailSlug),
      );

      if (typeof changeForThisEmail !== 'undefined') {
        if (changeForThisEmail.event === 'unlink') {
          router.push('/');
        }
      }
    });
  }

  return (
    <PreviewContext.Provider
      value={{
        emailPath,
        emailSlug,
        renderedEmailMetadata,
        renderingResult,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};
