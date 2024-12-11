'use client';
import type { ErrorObject } from '../../../utils/types/error-object';

export const RenderingError = (props: { error: ErrorObject }) => {
  return (
    <>
      <div className="absolute inset-0 z-50 bg-black/80" />
      <div className="absolute left-[50%] top-[50%] z-50 grid min-h-[50vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-t-sm border border-t-4 bg-white p-6 text-black shadow-lg duration-200 sm:rounded-lg md:max-w-[568px] lg:max-w-[968px]">
        <div className="flex min-w-0 max-w-full flex-col space-y-1.5">
          <h2 className="flex flex-shrink items-center gap-4 pb-2 text-lg font-semibold leading-none tracking-tight">
            <svg
              className="h-6 w-6 font-extrabold text-red-600"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            {props.error.name}: {props.error.message}
          </h2>
          {props.error.stack ? (
            <div className="flex-grow scroll-px-4 overflow-x-auto rounded-lg bg-red-500 p-2 text-sm text-gray-100">
              <pre className="w-full min-w-0 font-mono leading-7">
                {props.error.stack}
              </pre>
            </div>
          ) : undefined}
        </div>
      </div>
    </>
  );
};
