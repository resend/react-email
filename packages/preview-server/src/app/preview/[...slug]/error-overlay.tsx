'use client';

import type { ErrorObject } from '../../../utils/types/error-object';

interface ErrorOverlayProps {
  error: ErrorObject;
}

const Message = ({ children: content }: { children: string }) => {
  const match = content.match(
    /(Unexpected closing tag "[^"]+". It may happen when the tag has already been closed by another tag). (For more info see) (.+)/,
  );
  if (match) {
    const [_, errorMessage, moreInfo, link] = match;
    return (
      <>
        {errorMessage}.
        <p className="text-lg">
          {moreInfo}{' '}
          <a className="underline" rel="noreferrer" target="_blank" href={link}>
            {link}
          </a>
        </p>
      </>
    );
  }
  return content;
};

export const ErrorOverlay = ({ error }: ErrorOverlayProps) => {
  return (
    <>
      <div className="absolute inset-0 z-50 bg-black/80" />
      <div
        className="
        min-h-[50vh] w-full max-w-lg sm:rounded-lg md:max-w-[568px] lg:max-w-[920px]
        absolute left-[50%] top-[50%] z-50  translate-x-[-50%] translate-y-[-50%] 
        rounded-t-sm overflow-hidden bg-white text-black shadow-lg duration-200
        flex flex-col selection:!text-black
      "
      >
        <div className="bg-red-500 h-3" />
        <div className="flex flex-grow p-6 min-w-0 max-w-full flex-col space-y-1.5">
          <div className="flex-shrink pb-2 text-xl tracking-tight">
            <b>{error.name}</b>: <Message>{error.message}</Message>
          </div>
          {error.stack ? (
            <div className="flex-grow scroll-px-4 overflow-x-auto rounded-lg bg-black p-2 text-gray-100">
              <pre className="w-full min-w-0 font-mono leading-6 selection:!text-cyan-12 text-xs">
                {error.stack}
              </pre>
            </div>
          ) : undefined}
        </div>
      </div>
    </>
  );
};
