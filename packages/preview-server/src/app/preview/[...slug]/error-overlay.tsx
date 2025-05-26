'use client';
import type { ErrorObject } from '../../../utils/types/error-object';

export const ErrorOverlay = (props: { error: ErrorObject }) => {
  return (
    <>
      <div className="absolute inset-0 z-50 bg-black/80" />
      <div
        className="
        min-h-[50vh] w-full max-w-lg sm:rounded-lg md:max-w-[568px] lg:max-w-[920px]
        absolute left-[50%] top-[50%] z-50  translate-x-[-50%] translate-y-[-50%] 
        rounded-t-sm overflow-hidden bg-white selection:text-black text-black shadow-lg duration-200
        flex flex-col
      "
      >
        <div className="bg-red-500 h-3" />
        <div className="flex flex-grow p-6 min-w-0 max-w-full flex-col space-y-1.5">
          <h2 className="flex-shrink pb-2 text-xl leading-none tracking-tight">
            <b>{props.error.name}</b>: {props.error.message}
          </h2>
          {props.error.stack ? (
            <div className="flex-grow scroll-px-4 overflow-x-auto rounded-lg bg-black p-2 text-gray-100">
              <pre className="w-full min-w-0 font-mono leading-6 selection:text-white text-xs">
                {props.error.stack}
              </pre>
            </div>
          ) : undefined}
        </div>
      </div>
    </>
  );
};
